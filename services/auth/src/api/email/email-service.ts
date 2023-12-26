import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { Roles } from '../../config/roles-default';

export class EmailService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async checkEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async verifyEmail(email: string) {
    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email,
          isVerified: true,
        },
      });

      await tx.userRole.create({
        data: {
          roleTitle: Roles.USER,
          userId: user.id,
        },
      });

      return user;
    });

    return user;
  }
}
