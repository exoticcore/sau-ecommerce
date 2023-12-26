import express from 'express';
import EmailController from './email-controller';
import validator from '../../middleware/validator';
import { VerifyEmailDTO } from './emal.dto';

const email = new EmailController();

const router = express.Router();

router.post('/validate', email.validateEmail);
router.get('/verify', email.verifyEmail);

export default router;
