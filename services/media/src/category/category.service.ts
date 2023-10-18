import {
  Inject,
  Injectable,
  //   OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
// import { UploadMessageType } from '../upload/dto';
import { extension } from 'mime-types';
import { existsSync, mkdirSync, writeFile } from 'fs';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @Inject('UPLOAD_SERVICE') private readonly client: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const requestPattern = ['media.upload.image.category'];
    requestPattern.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
    await this.client.connect();
  }

  async getCategoryImage(file: string) {
    return await this.prisma.category.findUnique({
      where: {
        file_name: file,
      },
    });
  }

  async uploadImage(dataInfo: any) {
    const dir = `upload/category`;
    const type = extension(dataInfo.file.mimetype);
    const file = `${dataInfo.title}.${type}`;
    const path = `${dir}/${file}`;
    const buffer = Buffer.from(dataInfo.file.buffer.data);

    if (type) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFile(path, buffer, (err) => {
        if (err) {
          this.client.emit('media.upload.image.category', {
            value: JSON.stringify({
              title: dataInfo.title,
            }),
            key: 'uploaded_err',
            partition: 2,
          });
          return null;
        }
      });

      const image = await this.prisma.category.create({
        data: {
          title: dataInfo.title,
          file_name: file,
          content_type: dataInfo.file.mimetype,
          path: path,
        },
      });

      this.client.emit('media.upload.image.category', {
        value: JSON.stringify({
          title: image.title,
          path: `media/category/${file}`,
          catId: dataInfo.catId,
        }),
        key: 'uploaded_info',
        partition: 1,
      });
    }
  }

  async deleteAllImage() {
    return await this.prisma.image.deleteMany();
  }
}
