import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthorizeError } from '../../error/index.js';
import { generators } from 'openid-client';
import { redis } from '../../config/redis.js';
import { LoginType } from './auth-model.js';
import crypto from 'crypto';
import AuthService from './auth-service.js';
import { encryptData } from '../../utils/encrypt.js';

// Login with email & password
export const emailLogin = async (req: Request, res: Response) => {
  const loginForm: LoginType = req.body;

  const authService = new AuthService();

  const userInfo = await authService.getUserByEmail(loginForm.email);

  if (!userInfo || !userInfo[0])
    throw new BadRequestError('invalid email or password');

  const verifiedEmail = userInfo[0].emailVerified;
  if (!verifiedEmail) throw new UnauthorizeError('please verify your email');

  const enabled = userInfo[0].enabled;
  if (!enabled) throw new UnauthorizeError('user not enabled');

  const token = await authService.loginEmail(loginForm);

  if (loginForm.remember_me) {
    res.cookie('token', token.refresh_token, {
      signed: true,
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months
    });
  } else {
    req.session.refresh_token = token.refresh_token;
  }

  const encryptedToken = encryptData(<string>token.refresh_token);

  return res.status(StatusCodes.OK).json({ token: encryptedToken });
};

// SignIn with Google Identity Provider
export const google = async (req: Request, res: Response) => {
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);

  const key = crypto.randomBytes(16).toString('hex');
  await redis.set(key, code_verifier);

  const authService = new AuthService();
  const url = await authService.googleUrl(code_challenge, key);

  return res.redirect(url);
};

// Call back from Identities Provider
export const callback = async (req: Request, res: Response) => {
  const { state } = req.query;

  if (!state) throw new BadRequestError('State not found');

  const code_verifier = await redis.get(<string>state);
  if (!code_verifier) throw new BadRequestError('Code verifier not found');

  const userInfo = await new AuthService().callbackAuth(
    req,
    code_verifier,
    <string>state
  );

  req.session.refresh_token = userInfo.refresh_token;
  return res.status(StatusCodes.OK).json({ token: userInfo.refresh_token });
};

// Logout
export const logout = async (req: Request, res: Response) => {
  const token = req.signedCookies.token || req.session.refresh_token;
  await new AuthService().logout(token);
  req.session.cookie.expires = new Date(Date.now());
  res.cookie('token', '', {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ message: 'Logged out' });
};
