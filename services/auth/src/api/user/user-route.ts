import express from 'express';
import UserController from './user-controller';
import validator from '../../middleware/validator';
import { PasswordDTO, SignupUserDTO } from './user-dto';
import authorization from '../../middleware/authorization';

const user = new UserController();

const router = express.Router();

router.post(
  '/signup',
  validator(SignupUserDTO),
  authorization(null),
  user.signupUser
);
router.post(
  '/password',
  validator(PasswordDTO),
  authorization(null),
  user.setPassword
);
router.patch('/password', validator(PasswordDTO), authorization(null));
router.get('/info', authorization(null), user.getUserInfo);

export default router;
