import express from 'express';
import registerRoute from './registerRoute';
import loginRoute from './loginRoute';
import tokenRoute from './tokenRoute';

const router: express.Router = express.Router();

export default (): express.Router => {
  registerRoute(router);
  loginRoute(router);
  tokenRoute(router);
  return router;
};
