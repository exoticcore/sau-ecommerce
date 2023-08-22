import { Request, Response } from 'express';
import axios from 'axios';
import * as CustomError from '../errors';
import { StatusCodes } from 'http-status-codes';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequest('Please provide Email and Password');
  }

  let params = new URLSearchParams();
  params.append('client_id', 'node-js');
  params.append('client_secret', <string>process.env.CLIENT_SECRET);
  params.append('grant_type', 'password');
  params.append('scope', 'openid offline_access');
  params.append('username', email);
  params.append('password', password);

  try {
    const user = await axios.post(
      `${process.env.KEY_HOST}/realms/${process.env.REALMS}/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log(user);
    res.status(StatusCodes.OK).json({ refreshToken: user.data?.refresh_token });
  } catch (err) {
    throw new CustomError.UnauthenticatedError(`${err}`);
  }
};
