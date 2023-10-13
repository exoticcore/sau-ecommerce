import express from 'express';
import * as UserController from './user-controller.js';
import authorization from '../../middleware/authorization.js';
import validator from '../../middleware/validator.js';
import { registerValidate } from './user-model.js';

const router = express.Router();

router.post('/register', validator(registerValidate), UserController.register);
router.get('/info', authorization(null), UserController.userInfo);
router.patch('/edit');

export default router;
