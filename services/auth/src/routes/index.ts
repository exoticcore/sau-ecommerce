import express from 'express';
import authRoute from '../api/auth/auth-route.js';
import userRoute from '../api/user/user-route.js';
import tokenRoute from '../api/token/token-route.js';
import emailRoute from '../api/email/email-route.js';

const router = express.Router();

export default (): express.Router => {
  router.use('/', authRoute);
  router.use('/user', userRoute);
  router.use('/token', tokenRoute);
  router.use('/email', emailRoute);

  return router;
};
