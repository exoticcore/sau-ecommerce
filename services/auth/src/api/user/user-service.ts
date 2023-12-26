import { PrismaClient } from '@prisma/client';
import { redis } from '../../config/redis';
import prisma from '../../config/prisma';
import { SignupUserDTO } from './user-dto';

export default class UserService {
  private readonly prisma: PrismaClient;
  private readonly redis: typeof redis;

  constructor() {
    this.prisma = prisma;
    this.redis = redis;
  }

  async getUserByID(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async addInfo(email: string, userInfo: SignupUserDTO) {
    return await this.prisma.user.update({
      data: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        givenName: userInfo.firstName + ' ' + userInfo.lastName,
      },
      where: {
        email: email,
      },
    });
  }

  async setPassword(email: string, password: string) {
    return await this.prisma.user.update({
      data: {
        password: password,
      },
      where: {
        email: email,
      },
    });
  }
}
