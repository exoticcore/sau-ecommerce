import { Express, Request, Response } from 'express';
import * as CustomError from '../errors';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new CustomError.UnauthenticatedError('Invalid Token');
  }

  let params = new URLSearchParams();
  params.append('refresh_token', refreshToken);
  params.append('client_id', <string>process.env.CLIENT);
  params.append('client_secret', <string>process.env.CLIENT_SECRET);

  try {
    await axios.post(
      `${process.env.KEY_HOST}/realms/${process.env.REALMS}/protocol/openid-connect/logout`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.NO_CONTENT).json({ message: 'loged out' });
  } catch (err) {
    throw new CustomError.UnauthenticatedError(`${err}`);
  }
};
