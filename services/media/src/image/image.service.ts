import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import {
  DeleteMessageType,
  UpdateMessageType,
  UploadMessageType,
} from './dto/image-message.dto';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getPublicImage(key: string, file: string) {
    const image = await this.prisma.image.findUnique({
      where: {
        path: `${key}/${file}`,
      },
    });

    if (!image || image.is_private)
      throw new HttpException('image not found', HttpStatus.NOT_FOUND);

    const object = await this.s3.getObject(image.path);

    return { ...image, Buffer: object.Body };
  }

  async uploadImage(message: UploadMessageType) {
    const image = await this.prisma.image.findUnique({
      where: {
        path: message.path,
      },
    });
    if (!image) {
      await this.prisma.image.create({
        data: {
          title: message.title,
          file_name: message.file,
          path: message.path,
          content_type: message.mimetype,
          is_private: message.is_private,
        },
      });
    }
  }

  async updateImage(message: UpdateMessageType) {
    const image = await this.prisma.image.findUnique({
      where: {
        path: message.oldPath,
      },
    });

    if (image) {
      await this.prisma.image.update({
        where: {
          path: message.oldPath,
        },
        data: {
          ...message,
        },
      });
    }
  }

  async deleteImage(message: DeleteMessageType) {
    const image = await this.prisma.image.findUnique({
      where: {
        path: message.path,
      },
    });

    if (image) {
      await this.prisma.image.delete({
        where: {
          path: message.path,
        },
      });
    }
  }

  async deleteAllImages() {
    return await this.prisma.image.deleteMany();
  }

  async getAllImagesList() {
    return await this.prisma.image.findMany();
  }
}
