import express from 'express';
import { login } from '../controllers/loginController';

export default (router: express.Router) => {
  router.post('/login', login);
};
