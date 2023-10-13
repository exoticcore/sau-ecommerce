import { SessionOptions } from 'express-session';
import { redis } from './redis';

export const sessionCofig: SessionOptions = {
  secret: 'mysecretnaja',
  resave: false,
  saveUninitialized: true,

  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

declare module 'express-session' {
  export interface SessionData {
    refresh_token: string;
    access_token: string;
  }
}
