import { Request, Response } from 'express';
import { redis } from '../../config/redis';
import { BadRequestError, UnauthorizeError } from '../../error';
import { EmailService } from './email-service';
import { StatusCodes } from 'http-status-codes';
import sendVerify from '../../utils/nodemailer.js';

const emailService = new EmailService();

// Verify email from url link
export const emailVerify = async (req: Request, res: Response) => {
  const { code } = req.params;

  const verifyInfo = await redis.hGetAll(code);
  if (!verifyInfo) throw new UnauthorizeError('unauthorised code');

  const expiresIn = parseInt(verifyInfo.expiresIn);
  if (expiresIn < Date.now() || !verifyInfo.id)
    throw new BadRequestError('verify code is expired');

  await emailService.verifyEmail(verifyInfo.id);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: 'your email has been verified 👏🏻' });
};

// Resend email verify
export const resendVerifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const userInfo = await emailService.getUserByEmail(email);
  if (!userInfo || !userInfo[0])
    throw new BadRequestError('not found your email');

  const verifiedEmail = userInfo[0].emailVerified;
  if (verifiedEmail)
    throw new BadRequestError('your email has been verifed already');

  await sendVerify(email, <string>userInfo[0].id);

  return res
    .status(StatusCodes.OK)
    .json({ message: 'resend verify email successfully' });
};

// Confirm url link from email to Reset password
export const resetPassword = async (req: Request, res: Response) => {
  return res.send('Reset password controller');
};
