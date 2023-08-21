import { Request, Response } from 'express';
import * as CustomError from '../errors';
import { Role } from '@prisma/client';
import * as AuthService from '../services/authService';
import { authentication, random, verifyToken } from '../utils/generateKey';
import { StatusCodes } from 'http-status-codes';

export const register = async (req: Request, res: Response) => {
  const user = req.body;

  if (!user.email || !user.password) {
    throw new CustomError.BadRequestError('Please provide Email and Password');
  }

  const emailAlreadyExists = await AuthService.checkEmail(user.email);

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email alread exists');
  }

  let role: Role = Role.USER;
  const isFristUser = await AuthService.countUser();
  if (!isFristUser) role = Role.ADMIN;

  const saltAuth = random();
  const verificationToken = verifyToken();
  const passwordHash = authentication(saltAuth, user.password);

  const dataRegister = {
    ...user,
    password: passwordHash,
    role,
    saltAuth,
    verificationToken,
  };

  const newUser = await AuthService.registerUser(dataRegister);

  res.status(StatusCodes.OK).json(newUser);
};

export const emailVerify = async (req: Request, res: Response) => {
  const { verify } = req.params;
};
