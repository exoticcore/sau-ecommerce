import { Router } from 'express';
import { logout } from '../controllers/logoutController';

export default (router: Router) => {
  router.post('/logout', logout);
};
