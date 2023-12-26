import { NextFunction, Request, Response } from 'express';
import { decryptData } from '../utils/encrypt';
import JwtToken from '../utils/jwt-token';
import { Roles } from '../config/roles-default';

const jwtToken = new JwtToken();

export default (permissions: Roles[] | undefined | null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization;
    let token = req.signedCookies.access_token || req.session.access_token;
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];

      const { error, tokenInfo }: any = await jwtToken.verifyToken(
        decryptData(bearerToken)
      );
      if (error || !tokenInfo) {
        return res.status(401).json({ message: error });
      }

      if (permissions) {
        let isNext = false;
        tokenInfo.roles.map((role: string) => {
          permissions.map((permission: Roles) => {
            if (role === permission) {
              isNext = true;
              return;
            }
          });
        });
        if (!isNext) {
          return res.status(403).json({ message: 'forb' });
        }
        res.locals.accessToken = tokenInfo;
        return next();
      }

      res.locals.accessToken = tokenInfo;
      return next();
    }
    if (token) {
      const { error, tokenInfo } = await jwtToken.verifyToken(token);

      if (error) {
        return res.status(401).json({ message: error });
      }

      res.locals.accessToken = tokenInfo;
      return next();
    }

    return res.status(401).json({ message: 'invalid credentials' });
  };
};
