import { Request, Response } from 'express';
import { TokenService } from './token-service';
import { encryptData } from '../../utils/encrypt';
import { StatusCodes } from 'http-status-codes';

const tokenService = new TokenService();

export const accessToken = async (req: Request, res: Response) => {
  const token = <string>req.query.refresh_token;
  const isCookie = <string>req.query.isCookie;

  const tokenSet = await tokenService.getAccessToken(token);
  const encryptedToken = encryptData(<string>tokenSet.access_token);

  if (!isCookie) {
    res.cookie('access_token', tokenSet.access_token, {
      signed: true,
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 30 * 3000),
    });
  } else {
    req.session.access_token = tokenSet.access_token;
  }

  return res.status(StatusCodes.OK).json({ token: encryptedToken });
};
