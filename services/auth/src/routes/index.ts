import express from 'express';
import registerRoute from './registerRoute';

const router: express.Router = express.Router();

export default (): express.Router => {
  registerRoute(router);
  return router;
};
