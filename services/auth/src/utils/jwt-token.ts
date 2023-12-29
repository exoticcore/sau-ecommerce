import jwt, { decode } from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_REFRESH_EXPRIES,
  JWT_ACCESS_EXPRIES,
} from '../config/constant';
import prisma from '../config/prisma';
import { Request } from 'express';
import { PrismaClient, Token } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface RefreshPayload {
  id: string;
  email: string;
  deviceId?: string;
}

export interface AccessPayload {
  id: string;
  email: string;
  given_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  roles: string[];
  picture?: string;
}

interface NewRefreshToken {
  refreshToken: string;
  userId: string;
  deviceId: string;
  device?: string;
  timezone?: string;
  ip?: string;
  expriedAt: number;
}

export default class JwtToken {
  private readonly prisma: PrismaClient;
  private readonly jwt: typeof jwt;
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_EXPRIES: number;
  private readonly JWT_ACCESS_EXPRIES: number;

  constructor() {
    this.prisma = prisma;
    this.jwt = jwt;
    this.JWT_SECRET = JWT_SECRET;
    this.JWT_REFRESH_EXPRIES = <number>JWT_REFRESH_EXPRIES;
    this.JWT_ACCESS_EXPRIES = <number>JWT_ACCESS_EXPRIES;
  }

  // verify token method
  async verifyToken(token: string) {
    let error;
    let tokenInfo;

    this.jwt.verify(token, this.JWT_SECRET, (err, decoded) => {
      if (err) {
        error = err.message;
      }

      tokenInfo = decoded;
    });

    return { error, tokenInfo };
  }

  // generate refresh token method
  async generateRefreshToken(
    req: Request,
    payload: RefreshPayload
  ): Promise<Token> {
    const refreshToken = jwt.sign({ ...payload }, this.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.JWT_REFRESH_EXPRIES,
    });

    const newTokenInfo: NewRefreshToken = {
      refreshToken,
      userId: payload.id,
      deviceId: randomUUID(),
      device: req.useragent?.os,
      timezone: <string | undefined>req.headers['X-Timezone'],
      ip: req.ip,
      expriedAt: Date.now() + this.JWT_REFRESH_EXPRIES * 1000,
    };

    const deviceId = req.signedCookies.uuid || undefined;
    if (!deviceId) {
      return await this.createNewToken(newTokenInfo);
    } else {
      const isToken = await this.getTokenByDeviceId(deviceId);

      if (!isToken) {
        return await this.createNewToken(newTokenInfo);
      }

      return await this.updateToken(
        deviceId,
        payload.id,
        refreshToken,
        newTokenInfo.expriedAt,
        req.ip
      );
    }
  }

  // generate access token method
  getnerateAccessToken(payload: AccessPayload) {
    return this.jwt.sign(payload, this.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.JWT_ACCESS_EXPRIES,
    });
  }

  private async getTokenByDeviceId(deviceId: string) {
    return await this.prisma.token.findUnique({ where: { deviceId } });
  }

  private async createNewToken(tokenInfo: NewRefreshToken) {
    return await this.prisma.token.create({
      data: {
        ...tokenInfo,
      },
    });
  }

  private async updateToken(
    deviceId: string,
    userId: string,
    refreshToken: string,
    expriedAt: number,
    ip?: string | null
  ) {
    return await this.prisma.token.update({
      data: { refreshToken, expriedAt, userId, ip },
      where: {
        deviceId,
      },
    });
  }
}
