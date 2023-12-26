import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { redis } from '../config/redis';
import { VERIFY_TIMEOUT } from '../constant/index';

const { SMTP_HOST, SMTP_SERVICE, SMTP_USER, SMTP_PWD } = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(<string>SMTP_SERVICE),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PWD,
  },
});

const sendVerify = async (email: string, userId?: string): Promise<void> => {
  const verifyKey = crypto.randomBytes(32).toString('hex');
  await redis.hSet(email, {
    key: verifyKey,
    timeout: Date.now() + VERIFY_TIMEOUT,
  });

  await transport.sendMail({
    from: '"NASK SUPPORT" support@nask.com',
    to: 'multicorejapan@gmail.com',
    subject: 'NASK - Verify email',
    text: `test <b>text test</b>`,
    html: `
      <html>
        <head></head>
        <body>
          please verify your email 
          <a href='http://localhost:3000/api/v1/auth/email/verify/?key=${verifyKey}&email=${email}'>click here</a>
        </body>
      </html>
    `,
  });
};

export default sendVerify;
