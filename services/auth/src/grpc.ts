import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { TokensHandlers } from './proto/tokens/Tokens';
import { AccessToken } from './proto/tokens/AccessToken';
import { TokenInfo } from './proto/tokens/TokenInfo';
import { ProtoGrpcType } from './proto/token';
import prisma from './config/prisma';
import JwtToken from './utils/jwt-token';
import { decryptData } from './utils/encrypt';

const jwtToken = new JwtToken();

const host = '0.0.0.0:50051';

const tokenServer: TokensHandlers = {
  async verify(
    call: grpc.ServerUnaryCall<AccessToken, TokenInfo>,
    callback: grpc.sendUnaryData<TokenInfo>
  ) {
    try {
      if (call.request.token) {
        const { error, tokenInfo }: any = await jwtToken.verifyToken(
          decryptData(call.request.token)
        );
        if (tokenInfo) {
          return callback(null, {
            id: tokenInfo.id,
            givenName: tokenInfo.given_name,
            firstName: tokenInfo.first_name,
            lastName: tokenInfo.last_name,
            roles: tokenInfo.roles,
          });
        }
        return callback({ code: grpc.status.INVALID_ARGUMENT, message: error });
      }
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Unauthorization error',
      });
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'internal server error',
      });
    }
  },
};

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, '../proto/token.proto')
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const server = new grpc.Server();
server.addService(proto.tokens.Tokens.service, tokenServer);
server.bindAsync(host, grpc.ServerCredentials.createInsecure(), () => {
  console.log('grpc is running');
  server.start();
});

// export function getServer(): grpc.Server {
//   const packageDefinition = protoLoader.loadSync('./proto/token.proto', {

//   });
//   const proto = grpc.loadPackageDefinition(
//     packageDefinition
//   ) as unknown as ProtoGrpcType;
//   const server = new grpc.Server();
//   server.addService(proto.tokens.Tokens.service, tokenServer);
//   return server;
// }

// if (require.main === module) {
//   const server = getServer();
//   server.bindAsync(
//     host,
//     grpc.ServerCredentials.createInsecure(),
//     (err: Error | null, port: number) => {
//       if (err) {
//         console.log(`Server error: ${err.message}`);
//       } else {
//         console.log(`Server bound on port: ${port}`);
//         server.start();
//       }
//     }
//   );
// }
