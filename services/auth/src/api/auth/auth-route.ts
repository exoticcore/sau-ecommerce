import express from 'express';
import AuthController from './auth-controller';
import passport from 'passport';
import validator from '../../middleware/validator';
import { LoginEmailDTO } from './auth-dto';

const auth = new AuthController();

const router = express.Router();

router.post('/login', validator(LoginEmailDTO), auth.login);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  auth.googleCb
);

export default router;
