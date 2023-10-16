import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { redis } from '../config/redis.js';

const transport = nodemailer.createTransport({
  host: <string>process.env.SMTP_HOST,
  port: parseInt(<string>process.env.SMTP_SERVICE),
  secure: true,
  auth: {
    user: <string>process.env.SMTP_USER,
    pass: <string>process.env.SMTP_PWD,
  },
});

const sendVerify = async (email: string, userId: string): Promise<void> => {
  const verifyKey = crypto.randomBytes(32).toString('hex');
  await redis.hSet(verifyKey, {
    id: userId,
    expiresIn: Date.now() + 15 * 60 * 1000,
  });
  await transport.sendMail({
    from: '"SAU Ecommerce Support" support@sauecom.com',
    to: 'multicorejapan@gmail.com',
    subject: 'Verify email',
    text: `test <b>text test</b>`,
    html: `<b style='color:red'><a href='http://localhost:3000/api/v1/auth/email/verify/${verifyKey}'>verify email</a></b>`,
  });
};

export default sendVerify;
