import { NextFunction, Request, Response } from 'express';
import JwtToken from '../utils/jwt-token';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../config/prisma';

const jwtToken = new JwtToken();

type jwtVerifyType = {};

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.signedCookies.token || req.session.refresh_token;
  const deviceId = req.signedCookies.uuid;

  if (refreshToken && deviceId) {
    const isToken = await prisma.token.findUnique({ where: { deviceId } });
    if (
      !isToken ||
      isToken.deviceId !== deviceId ||
      isToken.refreshToken !== refreshToken
    ) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const tokenInfo = await jwtToken.verifyToken(refreshToken);
    res.locals.refreshToken = tokenInfo;
    res.locals.deviceId = isToken.deviceId;
    return next();
  }

  return res.status(401).json({ message: 'invalid credentials' });
};
