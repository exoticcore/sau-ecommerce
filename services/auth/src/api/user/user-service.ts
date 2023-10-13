import { RegisterUserType } from './user-model.js';
import Service from '../../utils/service.js';

export default class UserService extends Service {
  constructor() {
    super();
  }
  public async createUser(user: RegisterUserType) {
    const created = await this.keycloak.users.create({
      email: user.email,
      emailVerified: false,
      firstName: user.firstName,
      lastName: user.lastName,
      enabled: true,
      requiredActions: [''],
      credentials: [
        {
          temporary: false,
          type: 'password',
          value: user.password,
        },
      ],
      attributes: {
        phone: user.phone,
      },
    });

    return created;
  }
}
