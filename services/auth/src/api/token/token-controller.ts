import { Request, Response } from 'express';
import TokenService from './token-service';
import JwtToken, { RefreshPayload } from '../../utils/jwt-token';
import { AccessPayload } from '../../utils/jwt-token';
import { encryptData } from '../../utils/encrypt';

const tokenService = new TokenService();
const jwtToken = new JwtToken();

export default class TokenController {
  async getAccessToken(req: Request, res: Response) {
    const tokenInfo: RefreshPayload = res.locals.refreshToken;
    const deviceId: string = res.locals.deviceId;
    if (!tokenInfo || !deviceId) {
      return res.status(400).json({ message: 'bad request error' });
    }

    try {
      const token = await tokenService.getRefreshTokenByDeviceId(deviceId);

      if (!token) {
        return res.status(400).json({ message: 'bad request error' });
      }

      const refreshPayload: RefreshPayload = {
        id: token.user.id,
        email: token.user.email,
      };

      const refreshToken = await jwtToken.generateRefreshToken(
        req,
        refreshPayload
      );

      const roles = token.user.role.map((role) => {
        return role.roleTitle;
      });

      const accessPayload: AccessPayload = {
        id: token.user.id,
        email: token.user.email,
        given_name: token.user.givenName || undefined,
        first_name: token.user.firstName || undefined,
        last_name: token.user.lastName || undefined,
        phone: token.user.phone || undefined,
        picture: token.user.picture || undefined,
        roles,
      };
      const accessToken = jwtToken.getnerateAccessToken(accessPayload);
      const newToken = await tokenService.createAccessToken(
        refreshToken.deviceId,
        accessToken
      );

      if (!newToken.accessToken) {
        return res.status(500).json({ message: 'internal server error' });
      }

      const encryptToken = encryptData(newToken.accessToken);

      req.session.refresh_token = newToken.refreshToken;
      res.cookie('uuid', newToken.deviceId, {
        signed: true,
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      });

      return res.status(201).json({ access_token: encryptToken });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      res.status(500).json({ message: 'internal server error' });
    }
  }

  async introspectToken(req: Request, res: Response) {
    const jwtToken = res.locals.accessToken;
    return res.status(200).json(jwtToken);
  }

  async getNewRefreshToken(req: Request, res: Response) {}

  async revokeToken(req: Request, res: Response) {}

  async revokeAllTokens(req: Request, res: Response) {}
}
