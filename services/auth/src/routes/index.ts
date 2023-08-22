import express from 'express';
import registerRoute from './registerRoute';
import loginRoute from './loginRoute';

const router: express.Router = express.Router();

export default (): express.Router => {
  registerRoute(router);
  loginRoute(router);
  return router;
};
