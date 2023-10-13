import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app: express.Application = express();

app.use(helmet());
app.use(cors());

app.use('/', (req: express.Request, res: express.Response) => {
  return res.status(200).json({ message: 'first setup express' });
});

const port = parseInt(<string>process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
