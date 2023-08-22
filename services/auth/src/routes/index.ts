import express from 'express';
import authRoute from './authRoute';

const router: express.Router = express.Router();

export default (): express.Router => {
  authRoute(router);
  return router;
};
