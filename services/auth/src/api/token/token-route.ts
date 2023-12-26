import express from 'express';
import TokenController from './token-controller';
import { authentication } from '../../middleware/authenticate';
import authorization from '../../middleware/authorization';

const token = new TokenController();

const router = express.Router();

router.get('/', authentication, token.getAccessToken);
router.get('/refresh', authentication, token.getNewRefreshToken);
router.get('/introspect', authorization(null), token.introspectToken);
router.delete('/', authentication, authorization(null), token.revokeToken);
router.delete(
  '/all',
  authentication,
  authorization(null),
  token.revokeAllTokens
);

export default router;
