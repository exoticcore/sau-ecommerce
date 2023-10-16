import { CustomAPIError } from '../../error/custom-api.js';
import Service from '../../utils/service.js';

export class EmailService extends Service {
  constructor() {
    super();
  }

  public async verifyEmail(userId: string) {
    try {
      await this.keycloak.users.update(
        { id: userId },
        { emailVerified: true, requiredActions: [''] }
      );
    } catch (err) {
      throw new CustomAPIError('Internal server error');
    }
  }
}
