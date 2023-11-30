import { S3 } from 'aws-sdk';
import s3config from '../config/s3.js';
import {
  CopyObjectRequest,
  GetObjectRequest,
  HeadObjectRequest,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { CustomAPIError } from '../error/custom-error.js';
import { BadRequestError } from '../error/bad-request.js';

type S3ObjectRequest = GetObjectRequest | PutObjectRequest | HeadObjectRequest;

export default class S3Object {
  public s3: S3;

  constructor() {
    this.s3 = s3config;
  }

  public getObjectRequest(key: string): S3ObjectRequest {
    return {
      Bucket: <string>process.env.S3_BUCKET,
      Key: key,
    };
  }

  public async headObject(key: string) {
    return await this.s3
      .headObject({
        Bucket: <string>process.env.S3_BUCKET,
        Key: key,
      })
      .promise()
      .catch(() => {
        return false;
      });
  }

  public async uploadObject(params: PutObjectRequest) {
    const isObject = await this.headObject(params.Key);
    if (isObject) throw new BadRequestError('file already exists');

    await this.s3
      .upload(params)
      .promise()
      .catch(() => {
        throw new CustomAPIError('upload error');
      });
  }

  public async getObject(key: string) {
    const isObject = await this.headObject(key);
    if (!isObject) throw new CustomAPIError();

    return await this.s3
      .getObject(this.getObjectRequest(key))
      .promise()
      .catch(() => {
        throw new CustomAPIError();
      });
  }

  public async deleteObject(key: string) {
    const isObject = await this.headObject(key);
    if (!isObject) throw new CustomAPIError();

    await this.s3
      .deleteObject(this.getObjectRequest(key))
      .promise()
      .catch(() => {
        throw new CustomAPIError();
      });
  }
}
