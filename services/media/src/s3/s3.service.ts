import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  public s3: S3;
  constructor(private readonly config: ConfigService) {
    this.s3 = new S3({
      accessKeyId: config.get<string>('S3_ACCESS_KEY'),
      secretAccessKey: config.get<string>('S3_SECRET_KEY'),
      region: config.get<string>('S3_REGION'),
      endpoint: config.get<string>('S3_ENDPOINT'),
      s3ForcePathStyle: true,
    });
  }

  async getObject(key: string) {
    return await this.s3
      .getObject({
        Bucket: this.config.get<string>('S3_BUCKET'),
        Key: key,
      })
      .promise();
  }
}
