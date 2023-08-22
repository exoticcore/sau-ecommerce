import 'dotenv/config';
import 'express-async-errors';
// express
import express, { Application, Request, Response } from 'express';
const app: Application = express();
// sec dependencies
import cors from 'cors';
import helmet from 'helmet';
// cookie-parser
import cookieParser from 'cookie-parser';
// routers
import routes from './routes';
// middleware
import notFound from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

app.use(helmet());
app.use(
  cors({
    origin: process.env.ORIGINAL || true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/v1/auth', routes());

app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT: number = parseInt(<string>process.env.PORT) || 5000;

const connection = async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

connection();
