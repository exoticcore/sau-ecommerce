import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadImageDTO } from './dto/upload-image.dto';
import { existsSync, mkdirSync, renameSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadImage(
    file: Express.Multer.File,
    bucket: string,
    dto: UploadImageDTO,
  ) {
    const dir = `upload/${bucket}`;
    const fileType = file.mimetype.split('image/');
    const fileName = `${dto.title}.${fileType[1]}`;
    const filePath = `${dir}/${fileName}`;

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    renameSync(file.path, filePath);

    const created = await this.prisma.image.create({
      data: {
        title: dto.title,
        file_name: fileName,
        content_type: file.mimetype,
        path: filePath,
        is_private: dto.is_private,
      },
    });

    return created;
  }

  async deleteAllImage() {
    return await this.prisma.image.deleteMany();
  }
}
