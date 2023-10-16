import { NextFunction, Request, Response } from 'express';
import { UnauthorizeError } from '../error';
import openIdClient from '../config/openid-client';
import { decryptData } from '../utils/encrypt';

export enum Roles {
  admin = 'admin',
  manager = 'manager',
  user = 'user',
}

export default (permission: Roles | undefined | null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization;
    let token = req.signedCookies.access_token || req.session.access_token;
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.query.access_token = decryptData(bearerToken);
      return next();
    }
    if (token) {
      req.query.access_token = token;
      return next();
    }
    throw new UnauthorizeError('Invalid authoriztion credential');
  };
};
