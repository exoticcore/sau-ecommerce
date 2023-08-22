import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import generateAccessToken from '../utils/access-token';
import * as CustomError from '../errors';
import axios from 'axios';

export const checkUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  const adminToken = await generateAccessToken();
  console.log(adminToken);
  const user = await axios.get(
    `${process.env.KEY_HOST}/admin/realms/${process.env.REALMS}/users?email=${email}&exact=true`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

  let msg = 'No user';
  if (user.data[0]?.email) {
    msg = user.data;
  }
  res.status(StatusCodes.OK).json({ msg: msg });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const data = {
    enabled: true,
    attributes: {},
    email: email,
    emailVerified: true,
    firstName: firstName,
    lastName: lastName,
    realmRoles: ['user'],
    credentials: [
      {
        type: 'password',
        value: password,
        temporary: false,
      },
    ],
  };

  if (!email || !password) {
    throw new CustomError.BadRequest('Please provide Username and Password');
  }

  const adminToken = await generateAccessToken();
  const isUser = await axios.get(
    `${process.env.KEY_HOST}/admin/realms/${process.env.REALMS}/users?email=${email}&exact=true`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  if (isUser.data[0]?.email) {
    throw new CustomError.UnauthenticatedError('Invalid Email');
  }

  await axios
    .post(
      `${process.env.KEY_HOST}/admin/realms/${process.env.REALMS}/users`,
      data,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    )
    .catch((err) => {
      throw new CustomError.BadRequest(err);
    });

  res.status(StatusCodes.CREATED).json({ msg: 'created new user' });
};
