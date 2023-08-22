import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as CustomError from '../errors';
import axios from 'axios';

export const token = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new CustomError.UnauthenticatedError('Invalid Token');
  }

  let params = new URLSearchParams();
  params.append('client_id', <string>process.env.CLIENT);
  params.append('client_secret', <string>process.env.CLIENT_SECRET);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const accessToken = await axios
    .post(
      `${process.env.KEY_HOST}/realms/${process.env.REALMS}/protocol/openid-connect/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .catch((err) => {
      throw new CustomError.UnauthenticatedError(err);
    });

  console.log(accessToken);

  res.status(StatusCodes.OK).json(accessToken.data);
};

export const validateToken = async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const userInfo = await axios.get(
      `${process.env.KEY_HOST}/realms/${process.env.REALMS}/protocol/openid-connect/userinfo`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.status(StatusCodes.OK).json(userInfo.data);
  } else {
    throw new CustomError.UnauthenticatedError('Unautorized');
  }
};
