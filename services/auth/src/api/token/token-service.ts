import { UnauthorizeError } from '../../error';
import Service from '../../utils/service';

export class TokenService extends Service {
  constructor() {
    super();
  }

  public async getAccessToken(refreshToken: string) {
    try {
      const tokenSet = await this.openId.refresh(refreshToken);
      return tokenSet;
    } catch (err) {
      throw new UnauthorizeError('Invalid refresh token');
    }
  }

  public async introspectToken(accessToken: string) {
    try {
      const introspect = await this.openId.introspect(accessToken);
      return introspect;
    } catch (err) {
      throw new UnauthorizeError('Invalid access token');
    }
  }
}
