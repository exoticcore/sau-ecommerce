import express from 'express';
import { checkUser } from '../controllers/checkUserController';

export default (router: express.Router) => {
  router.post('checkUser', checkUser);
};
