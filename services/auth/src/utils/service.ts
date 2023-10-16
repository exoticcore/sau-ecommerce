import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { PrismaClient } from '@prisma/client';
import { BaseClient } from 'openid-client';
import prisma from '../config/prisma-client.js';
import openIdClient from '../config/openid-client.js';
import kcAdmin from '../config/keycloak-admin.js';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth.js';

export default class Service {
  public keycloak: KeycloakAdminClient;
  public prisma: PrismaClient;
  public openId: BaseClient;

  constructor() {
    this.keycloak = kcAdmin;
    this.prisma = prisma;
    this.openId = openIdClient;
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await this.keycloak.users.find({
        email,
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
