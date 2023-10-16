import { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma.js';
import redis from '../config/redis.js';

export default class Service {
  public prisma: PrismaClient;
  public redis: typeof redis;
  public isCache: boolean;

  constructor() {
    this.prisma = prisma;
    this.redis = redis;
    this.isCache = false;
  }

  public async redisGet(key: string) {
    const redisCached = await this.redis.get(key);
    let result;
    if (redisCached) {
      result = JSON.parse(redisCached);
      this.isCache = true;
      return result;
    } else {
      return false;
    }
  }

  public async redisSet(key: string, data: any) {
    return await redis.set(key, JSON.stringify(data), {
      EX: 180,
      NX: true,
    });
  }
}
