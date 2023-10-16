import { Request } from 'express';
import Service from '../../utils/service.js';
import { LoginType } from './auth-model.js';
import { UnauthorizeError } from '../../error/unauthorize.js';
import { CustomAPIError } from '../../error/custom-api.js';

export default class AuthService extends Service {
  private callback: string;

  constructor() {
    super();
    this.callback = 'http://localhost:3000/api/v1/auth/callback';
  }

  public async loginEmail(body: LoginType) {
    const tokenSet = await this.openId
      .grant({
        grant_type: 'password',
        username: body.email,
        password: body.password,
        scope: `openid email profile ${
          body.remember_me ? 'offline_access' : ''
        }`,
      })
      .catch((err) => {
        throw new UnauthorizeError('Invalid user credentials');
      });

    return tokenSet;
  }

  public async googleUrl(challengeCode: string, key: string): Promise<string> {
    const url = this.openId.authorizationUrl({
      scope: 'openid',
      code_challenge: challengeCode,
      code_challenge_method: 'S256',
      kc_idp_hint: 'google',
      state: key,
      redirect_uri: this.callback,
    });
    return url;
  }

  public async callbackAuth(
    req: Request,
    code_verifier: string,
    state: string
  ) {
    const params = this.openId.callbackParams(req);
    const tokenSet = await this.openId.callback(this.callback, params, {
      state,
      code_verifier,
    });
    return tokenSet;
  }

  public async logout(token: string) {
    try {
      this.openId.endSessionUrl();
      return await this.openId.revoke(token);
    } catch (err) {
      throw new CustomAPIError('Internal server error');
    }
  }
}
