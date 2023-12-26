import express from 'express';
import authRoute from './api/auth/auth-route';
import emailRoute from './api/email/email-route';
import userRoute from './api/user/user-route';
import tokenRouter from './api/token/token-route';

const router = express.Router();

export default (): express.Router => {
  router.use(authRoute);
  router.use('/email', emailRoute);
  router.use('/user', userRoute);
  router.use('/token', tokenRouter);

  return router;
};
