import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from '../proto/token';
import { TokenInfo } from '../proto/tokens/TokenInfo';
const packageDefinitionToken = protoLoader.loadSync(path.join(__dirname, '../../proto/token.proto'));
const tokenProto = grpc.loadPackageDefinition(packageDefinitionToken) as unknown as ProtoGrpcType;
const tokenStub = new tokenProto.tokens.Tokens('0.0.0.0:50051', grpc.credentials.createInsecure());

export enum Roles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export default (permissions: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header: string = req.headers.authorization;

      if (header) {
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        let accepted = false;

        tokenStub.verify({ token: bearerToken }, (err?: grpc.ServiceError, tokenInfo?: TokenInfo) => {
          if (err) {
            return next(new HttpException(401, err.details));
          } else if (tokenInfo) {
            tokenInfo.roles.map(role => {
              permissions.map(permission => {
                if (role === permission) {
                  return (accepted = true);
                }
              });
            });
          }

          if (accepted) {
            res.locals.user_info = tokenInfo;
            return next();
          } else {
            return next(new HttpException(403, 'Unthorization error'));
          }
        });
      } else {
        return next(new HttpException(401, 'Invalid credential'));
      }
    } catch (err) {
      return next(new HttpException(500, 'Internal server error'));
    }
  };
};
