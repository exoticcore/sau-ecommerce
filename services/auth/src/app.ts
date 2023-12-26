import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import session from 'express-session';
import { sessionCofig } from './config/session';

import passport from 'passport';
import './middleware/google-strategy';

import routes from './routes';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';

const app: express.Application = express();

app.set('trust proxy', true);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser(<string>process.env.COOKIE_SECRET));
app.use(session(sessionCofig));

app.use(passport.initialize());
app.use(express.json());
app.use(useragent.express());

app.use('/api/v1/auth', routes());

export default app;
