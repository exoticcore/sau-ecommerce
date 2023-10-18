import { Controller, Get, Param, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
// import { UploadMessageType } from '../upload/dto';
import { Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/:file')
  async getCategoryImage(@Param('file') file: string, @Res() res: Response) {
    const image = await this.categoryService.getCategoryImage(file);
    if (!image) return { message: 'image not found' };

    const fileBase64 = await readFile(
      join(process.cwd(), image.path),
      'base64',
    );
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const fileStream = Readable.from(fileBuffer);

    res.set({
      'Content-Type': image.content_type,
      'Content-Deisposition': `${image.title}_${Date.now()}`,
    });

    return fileStream.pipe(res);
  }

  @MessagePattern('media.upload.image.category')
  async uploadImage(@Payload() message: any, @Ctx() context: KafkaContext) {
    console.log(`partition: ${context.getPartition()}`);
    console.log(message);

    const partition = context.getPartition();
    // const categoryInfo = JSON.parse(message);
    if (partition === 0) {
      await this.categoryService.uploadImage(message);
    }
  }
}
