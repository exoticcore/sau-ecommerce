import 'dotenv/config';
// express
import express, { Application, Request, Response } from 'express';
const app: Application = express();
// sec dependencies
import rateLimiter from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
// routers
import routes from './routes';
// prisma db connection
import { checkDB } from './db/dbServer';

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(
  cors({
    origin: process.env.ORIGINAL || true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.use('/api/auth', routes());

const PORT: number = parseInt(<string>process.env.PORT) || 5000;

const connection = async () => {
  try {
    await checkDB();
    console.log(`postgresql connected to ${process.env.PSQL_DB}`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

connection();
