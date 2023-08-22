import express from 'express';
import * as RegisterController from '../controllers/registerController';

export default (router: express.Router) => {
  router.post('/check', RegisterController.checkUser);
  router.post('/register', RegisterController.register);
};
