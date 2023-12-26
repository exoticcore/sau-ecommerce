import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { redis } from '../../config/redis';

export default class TokenService {
  private readonly prisma: PrismaClient;
  private readonly redis: typeof redis;

  constructor() {
    this.prisma = prisma;
    this.redis = redis;
  }

  async getRefreshTokenByDeviceId(deviceId: string) {
    return await this.prisma.token.findUnique({
      where: {
        deviceId,
      },
      include: {
        user: {
          include: {
            role: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async createAccessToken(deviceId: string, accessToken: string) {
    return await this.prisma.token.update({
      data: {
        accessToken,
      },
      where: {
        deviceId,
      },
    });
  }
}
