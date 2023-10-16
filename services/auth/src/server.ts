import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { redis } from './config/redis.js';

import session from 'express-session';
import { sessionCofig } from './config/session.js';

import routes from './routes/index.js';
import notFound from './middleware/not-found.js';
import errorHandler from './middleware/error-handler.js';
import helmet from 'helmet';

const app: express.Application = express();

app.set('trust proxy', true);
app.use(cors());
app.use(helmet());
app.use(cookieParser(<string>process.env.COOKIE_SECRET));
app.use(session(sessionCofig));

app.use(express.json());

app.use('/api/v1/auth', routes());

app.use(notFound);
app.use(errorHandler);

const port: number = parseInt(<string>process.env.PORT) || 8888;

const start = async () => {
  try {
    redis.on('Error', (err: Error) => console.log('Redis Client Error', err));
    await redis.connect();

    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  } catch (err) {
    console.log(err);
  }
};

await start();
