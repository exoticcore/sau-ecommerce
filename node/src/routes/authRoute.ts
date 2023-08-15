import express from 'express';
import { register } from '../controllers/registerController';

export default (router: express.Router) => {
  router.post('/register', register);

  router.post('/login', () => {});

  router.delete('/logout', () => {});
};
