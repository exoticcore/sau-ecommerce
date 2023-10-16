import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from './user-service.js';
import {
  BadRequestError,
  CustomAPIError,
  UnauthorizeError,
} from '../../error/index.js';
import sendVerify from '../../utils/nodemailer.js';
import openIdClient from '../../config/openid-client';
import { RegisterUserType, UserInfo } from './user-model.js';

// Create the user
export const register = async (req: Request, res: Response) => {
  const regisForm: RegisterUserType = req.body;

  const userService = new UserService();

  const users = await userService.getUserByEmail(regisForm.email);

  if (users?.[0]) throw new BadRequestError('email not available.');

  try {
    const createdUser = await userService.createUser(regisForm);
    await sendVerify(regisForm.email, createdUser.id);
    res.status(StatusCodes.CREATED).json({ createdUser });
  } catch (err) {
    throw new CustomAPIError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// User Info
export const userInfo = async (req: Request, res: Response) => {
  const { access_token } = req.query;
  if (!access_token) throw new UnauthorizeError('Invalid creadentials');

  const user: any = await openIdClient
    .userinfo(<string>access_token)
    .catch((err) => {
      throw new UnauthorizeError('Invalid token credentials');
    });

  const roles: string[] = user.realm_access.roles.filter((role: string) => {
    if (
      role !== 'default-roles-nodejs' &&
      role !== 'offline_access' &&
      role !== 'uma_authorization'
    ) {
      return role;
    }
  });

  const userInfo: UserInfo = {
    sub: user.sub,
    email_verified: user.email_verified,
    roles: roles,
    name: user.name,
    preferred_username: user.preferred_username,
    given_name: user.given_name,
    family_name: user.family_name,
    email: user.email,
  };

  return res.status(StatusCodes.OK).json(userInfo);
};
