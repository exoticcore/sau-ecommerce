import { Controller, Get, Param, Res } from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/:bucket/:file')
  async getImage(
    @Param('bucket') bucket: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    const image = await this.mediaService.getImage(bucket, file);
    if (image.is_private) return { message: 'not found' };
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
}
