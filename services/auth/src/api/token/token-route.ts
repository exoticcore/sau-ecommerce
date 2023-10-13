import { Router } from 'express';
import * as TokenController from './token-controller.js';
import authentication from '../../middleware/authentication.js';

const router = Router();

router.post('/', authentication, TokenController.accessToken);
router.get('/introspect', authentication);

export default router;