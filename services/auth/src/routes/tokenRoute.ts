import express from 'express';
import * as TokenContoller from '../controllers/tokenController';

export default (router: express.Router) => {
  router.get('/token', TokenContoller.token);
};
