import { Request, Response } from 'express';
import { EmailService } from './email-service';
import { VERIFY_TIMEOUT } from '../../utils/constant';
import sendVerify from '../../utils/nodemailer';
import JwtToken from '../../utils/jwt-token';
import { redis } from '../../config/redis';
import { RefreshPayload } from '../../utils/jwt-token';

const emailService = new EmailService();
const jwtToken = new JwtToken();

export default class EmailController {
  async validateEmail(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const isEmail = await emailService.checkEmail(email);

      // available to login
      if (isEmail?.password && isEmail.isVerified) {
        return res.status(200).json({ isVerified: true, email: isEmail.email });
      }

      // check count of sending email
      const count = await redis.hGet(email, 'count');
      if (count) {
        if (parseInt(count) <= 0) {
          return res
            .status(400)
            .json({ message: 'please contract our support' });
        }
        await redis.hSet(email, { count: parseInt(count) - 1 });
      } else {
        await redis.hSet(email, { count: 5 });
      }

      await sendVerify(email);
      const newCount = await redis.hGet(email, 'count');
      return res.status(201).json({
        isVerified: false,
        timeout: VERIFY_TIMEOUT,
        email,
        count: parseInt(<string>newCount),
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const { key, email }: any = req.query;

    try {
      const verifyKey: any = await redis.hGetAll(email);
      console.log(verifyKey);
      if (!verifyKey.key || key !== verifyKey.key || !verifyKey.timeout) {
        return res.status(400).json({ message: 'bad request error' });
      }

      if (parseInt(verifyKey.timeout) < Date.now()) {
        return res.status(400).json({ message: 'verify url has been expried' });
      }

      let isEmail = await emailService.checkEmail(email);
      if (!isEmail?.email) {
        isEmail = await emailService.verifyEmail(email);
      }

      await redis.del(email);

      let payload: RefreshPayload = {
        id: isEmail.id,
        email: isEmail.email,
      };

      const refreshToken = await jwtToken.generateRefreshToken(req, payload);

      req.session.refresh_token = refreshToken.refreshToken;

      res.cookie('uuid', refreshToken.deviceId, {
        signed: true,
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      });

      return res.status(201).json({
        message: 'email has been verified',
        email: email,
        key: key,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
