import { NextFunction, Request, Response } from 'express';
import { UnauthorizeError } from '../error/index.js';
import openIdClient from '../config/openid-client.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  let token = req.signedCookies.token || req.session.refresh_token;
  if (token) {
    let isCookie = undefined;
    if (req.session.refresh_token) isCookie = 'session';
    const verifiedToken = await openIdClient.refresh(token);

    req.query.is_cookie = isCookie;
    req.query.refresh_token = verifiedToken.refresh_token;

    return next();
  }

  throw new UnauthorizeError('Invalid credentials');
};
