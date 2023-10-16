import express from 'express';
import * as AuthController from './auth-controller.js';
import authentication from '../../middleware/authentication.js';
import validator from '../../middleware/validator.js';
import { loginValidate } from './auth-model.js';

const router = express.Router();

router.post('/login', validator(loginValidate), AuthController.emailLogin);
router.post('/google', AuthController.google);
router.get('/callback', AuthController.callback);
router.delete('/logout', authentication, AuthController.logout);

export default router;
