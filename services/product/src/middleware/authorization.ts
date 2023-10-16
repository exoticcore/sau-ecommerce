import { NextFunction, Request, Response } from 'express';
import { UnauthoriseError } from '../error/unauthorize-error';
import axios from 'axios';

export default (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let verified = false;

    if (!authHeader) throw new UnauthoriseError('Invalid credentials');

    const { data } = await axios.get(
      'http://localhost:3000/api/v1/auth/user/info',
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    data.roles.filter((userRole: string) => {
      roles.filter((role) => {
        if (userRole === role) verified = true;
      });
    });

    if (!verified) throw new UnauthoriseError('unahorization');

    res.locals.user = data;
    return next();
  };
};
