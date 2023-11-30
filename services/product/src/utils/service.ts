import { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma.js';
import redis from '../config/redis.js';
import { Producer } from 'kafkajs';
import { producer } from '../config/kafka.js';
import S3Object from './s3object.js';
import { PutObjectRequest } from 'aws-sdk/clients/s3.js';

export default class Service extends S3Object {
  public prisma: PrismaClient;
  public producer: Producer;
  public redis: typeof redis;
  public isCache: boolean;
  private imageTopic: string;

  constructor() {
    super();
    this.prisma = prisma;
    this.producer = producer;
    this.redis = redis;
    this.isCache = false;
    this.imageTopic = 'media.image';
  }

  public async uploadImageProducer(
    params: PutObjectRequest,
    title: string,
    file: string,
    is_private?: boolean
  ) {
    await this.producer.connect();
    this.producer.send({
      topic: `${this.imageTopic}.upload`,
      messages: [
        {
          value: JSON.stringify({
            title: title,
            path: params.Key,
            file: file,
            mimetype: params.ContentType,
            is_private: is_private || null,
          }),
        },
      ],
    });
    await this.producer.disconnect();
  }

  public async updateImageProducer(
    params: PutObjectRequest,
    title: string,
    file: string,
    oldPath?: string,
    is_private?: boolean
  ) {
    await this.producer.connect();
    producer.send({
      topic: `${this.imageTopic}.update`,
      messages: [
        {
          value: JSON.stringify({
            oldPath: oldPath || null,
            title: title,
            file: file,
            path: params.Key,
            mimetype: params.ContentType,
            is_private: is_private || false,
          }),
        },
      ],
    });
    await this.producer.disconnect();
  }

  public async deleteImageProducer(path: string) {
    await this.producer.connect();
    this.producer.send({
      topic: `${this.imageTopic}.delete`,
      messages: [
        {
          value: JSON.stringify({
            path: path,
          }),
        },
      ],
    });
    await this.producer.disconnect();
  }
}
