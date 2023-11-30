import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
import {
  DeleteCategoryType,
  UpdateCategoryType,
  UploadMessageType,
} from './dto/upload-message.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @Inject('MEDIA_SERVICE') private readonly client: ClientKafka,
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async onModuleInit() {
    // const requestPattern = ['media.upload.image.category'];
    // requestPattern.forEach((pattern) => {
    //   this.client.subscribeToResponseOf(pattern);
    // });
    // await this.client.connect();
  }

  async getCategoryImage(file: string) {
    const media = await this.prisma.category.findUnique({
      where: {
        file_name: file,
      },
    });

    if (!media)
      throw new HttpException('image not found', HttpStatus.NOT_FOUND);

    const object = await this.s3.getObject(media.path);

    return { ...media, Buffer: object.Body };
  }

  async uploadCategory(dataInfo: UploadMessageType) {
    const media = await this.prisma.category.findUnique({
      where: {
        path: dataInfo.path,
      },
    });

    if (!media) {
      await this.prisma.category.create({
        data: {
          title: dataInfo.title,
          path: dataInfo.path,
          file_name: dataInfo.file,
          content_type: dataInfo.mimetype,
        },
      });
    }
  }

  async updateCategory(dataInfo: UpdateCategoryType) {
    const media = await this.prisma.category.findUnique({
      where: {
        path: dataInfo.oldPath,
      },
    });

    if (media) {
      await this.prisma.category.update({
        where: {
          path: dataInfo.oldPath,
        },
        data: {
          title: dataInfo.title,
          path: dataInfo.path,
          file_name: dataInfo.file,
          content_type: dataInfo.mimetype,
        },
      });
    }
  }

  async deleteCategoryByPath(dataInfo: DeleteCategoryType) {
    const media = await this.prisma.category.findUnique({
      where: {
        path: dataInfo.path,
      },
    });

    if (media) {
      await this.prisma.category.delete({
        where: {
          path: dataInfo.path,
        },
      });
    }
  }

  async getAllCategoryLists() {
    return await this.prisma.category.findMany();
  }

  async deleteAllImage() {
    return await this.prisma.category.deleteMany();
  }

  // async uploadImage(dataInfo: any) {
  //   const dir = `upload/category`;
  //   const type = extension(dataInfo.file.mimetype);
  //   const file = `${dataInfo.title}.${type}`;
  //   const path = `${dir}/${file}`;
  //   const buffer = Buffer.from(dataInfo.file.buffer.data);

  //   if (type) {
  //     if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  //     writeFile(path, buffer, (err) => {
  //       if (err) {
  //         this.client.emit('media.upload.image.category', {
  //           value: JSON.stringify({
  //             title: dataInfo.title,
  //           }),
  //           key: 'uploaded_err',
  //           partition: 2,
  //         });
  //         return null;
  //       }
  //     });

  //     const image = await this.prisma.category.create({
  //       data: {
  //         title: dataInfo.title,
  //         file_name: file,
  //         content_type: dataInfo.file.mimetype,
  //         path: path,
  //       },
  //     });

  //     this.client.emit('media.upload.image.category', {
  //       value: JSON.stringify({
  //         title: image.title,
  //         path: `media/category/${file}`,
  //         catId: dataInfo.catId,
  //       }),
  //       key: 'uploaded_info',
  //       partition: 1,
  //     });
  //   }
  // }
}
