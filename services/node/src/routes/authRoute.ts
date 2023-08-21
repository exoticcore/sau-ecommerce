import express from 'express';
import * as Auth from '../controllers/authController';

export default (router: express.Router) => {
  router.post('/register', Auth.register);

  router.post('/login', () => {});

  router.delete('/logout', () => {});
};
