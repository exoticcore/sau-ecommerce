import express from 'express';
import * as EmailController from './email-controller.js';

const router = express.Router();

router.get('/verify/:code', EmailController.emailVerify);
router.post('/reverify', EmailController.resendVerifyEmail);
router.post('/forget');

export default router;
