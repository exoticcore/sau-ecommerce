import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
import { UploadMessageType } from './dto';
import { extension } from 'mime-types';
import { existsSync, mkdirSync, writeFile } from 'fs';

@Injectable()
export class UploadService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject('UPLOAD_SERVICE') private readonly client: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onApplicationShutdown() {
    await this.client.close();
  }

  async onModuleInit() {
    const requestPattern = ['media.upload'];
    requestPattern.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
    await this.client.connect();
  }

  async uploadImage(dataInfo: UploadMessageType) {
    const type = extension(dataInfo.file.mimetype);
    const dir = `upload/${dataInfo.bucket}`;
    const file = `${dataInfo.title}.${type}`;
    const path = `${dir}/${file}`;
    const buffer = dataInfo.file.buffer;

    if (type) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFile(path, buffer, () => {
        this.client.emit('media.upload', {
          value: JSON.stringify(false),
          key: 'uploaded_info',
          partition: 1,
        });
        return null;
      });

      const image = await this.prisma.image.create({
        data: {
          title: dataInfo.title,
          file_name: file,
          content_type: dataInfo.file.mimetype,
          path: path,
          is_private: false,
        },
      });

      this.client.emit('media.upload', {
        value: JSON.stringify({
          title: image.title,
          path: image.path,
        }),
        key: 'uploaded_info',
        partition: 1,
      });
    }
  }

  async deleteAllImage() {
    return await this.prisma.image.deleteMany();
  }

  // async uploadImage(
  //   file: Express.Multer.File,
  //   bucket: string,
  //   dto: UploadImageDTO,
  // ) {
  //   const dir = `upload/${bucket}`;
  //   const fileType = file.mimetype.split('image/');
  //   const fileName = `${dto.title}.${fileType[1]}`;
  //   const filePath = `${dir}/${fileName}`;

  //   if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  //   renameSync(file.path, filePath);

  //   const created = await this.prisma.image.create({
  //     data: {
  //       title: dto.title,
  //       file_name: fileName,
  //       content_type: file.mimetype,
  //       path: filePath,
  //       is_private: dto.is_private,
  //     },
  //   });

  //   return created;
  // }
}
