import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDTO } from './dto/brand-message.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async createBrandMedia(message: CreateBrandDTO) {
    await this.prisma.category.create({
      data: {
        title: message.title,
        file_name: message.file,
        path: message.path,
        content_type: message.mimetype,
      },
    });
  }
}
