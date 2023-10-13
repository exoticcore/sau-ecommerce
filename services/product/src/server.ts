import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routes/index.js';
import notFound from './middleware/not-found.js';
import errorHandler from './middleware/error-handler.js';

const app: express.Application = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use('/api/v1/products', routes());

app.use(notFound);
app.use(errorHandler);

const port = parseInt(<string>process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});