import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { redis } from '../../config/redis';

export interface CreateUser {
  email: string;
  hash?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider?: string[];
}

export default class AuthService {
  private readonly prisma: PrismaClient;
  private readonly redis: typeof redis;

  constructor() {
    this.prisma = prisma;
    this.redis = redis;
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async checkEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return user;
    } catch (err) {
      if (err instanceof Error) {
        console.error('message: ', err.message);
      }
    }
  }

  async createUser(userInfo: CreateUser) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName || undefined,
          picture: userInfo.picture || undefined,
          provider: ['eiei'],
        },
      });
      return newUser;
    } catch (err) {}
  }
}
