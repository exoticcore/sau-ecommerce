import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async getImage(bucket: string, fileName: string) {
    return await this.prisma.image.findUnique({
      where: {
        path: `upload/${bucket}/${fileName}`,
      },
    });
  }
}
