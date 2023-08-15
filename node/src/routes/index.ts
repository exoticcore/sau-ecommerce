import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';

const router: express.Router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRoute(router);
  return router;
};
