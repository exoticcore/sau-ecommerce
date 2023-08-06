import express, { Application, Request, Response } from 'express';
const app: Application = express();

import rateLimiter from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';

// app.set('trust proxy', true);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(
  cors({
    origin: process.env.ORIGINURL || true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get('/api/v1', (req: Request, res: Response) => {
  return res.status(200).send('Hello from node');
});

const PORT: number = parseInt(<string>process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
