import { Request, Response } from 'express';
import AuthService from './auth-service';
import JwtToken from '../../utils/jwt-token';
import argon2 from 'argon2';
import { RefreshPayload } from '../../utils/jwt-token';
import { encryptData } from '../../utils/encrypt';
import { JWT_REFRESH_EXPRIES } from '../../config/constant';

const authService = new AuthService();
const jwtToken = new JwtToken();

export default class AuthController {
  constructor() {}

  async login(req: Request, res: Response) {
    const { email, password, remember } = req.body;

    try {
      const user = await authService.checkEmail(email);
      if (!user || !user?.password) {
        return res.status(401).json({ message: 'invalid email or password' });
      }

      const matchPwd = await argon2.verify(user.password, password);
      if (!matchPwd) {
        return res.status(401).json({ message: 'invalid email or password' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'please verify your email' });
      }

      const payload: RefreshPayload = {
        id: user.id,
        email: user.email,
      };

      const refreshToken = await jwtToken.generateRefreshToken(req, payload);
      if (remember) {
        return res.cookie('token', refreshToken.refreshToken, {
          signed: true,
          httpOnly: true,
          secure: true,
          expires: new Date(
            Date.now() +
              (<number>JWT_REFRESH_EXPRIES || 14 * 24 * 60 * 60 * 1000)
          ), // 2 weeks
        });
      } else {
        req.session.refresh_token = refreshToken.refreshToken;
      }

      res.cookie('uuid', refreshToken.deviceId, {
        signed: true,
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      });
      const encryptedToken = encryptData(refreshToken.refreshToken);
      return res.status(200).json({ token: encryptedToken });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async googleCb(req: Request, res: Response) {
    const user: any = req.user;
    const info: any = req.authInfo;
    console.log(info.test);

    if (!user) {
      return res.status(400).json({ message: 'bad request error' });
    }

    try {
      const isUser = await authService.checkEmail(user.emails[0].value);
      if (!isUser) {
        var newUser = await authService.createUser({
          email: user.emails[0].value,
          firstName: user.givenName,
          lastName: user.familyName,
          provider: ['google'],
        });
      }

      if (!newUser) {
        return res.status(400).json({ message: 'bad request error' });
      }

      const payload: RefreshPayload = {
        id: isUser?.id || newUser.id,
        email: user.emails[0].value,
      };

      const refreshToken = await jwtToken.generateRefreshToken(req, payload);
      req.session.refresh_token = refreshToken.refreshToken;
      res.cookie('uuid', refreshToken.deviceId, {
        signed: true,
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      });
      return res.redirect('http://localhost:10000');
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
