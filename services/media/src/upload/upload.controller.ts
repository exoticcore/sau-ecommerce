import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadImageDTO } from './dto';

@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/image/:bucket')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/png' || 'image/jpg' || 'image/jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
    )
    file: Express.Multer.File,
    @Param('bucket') bucket: string,
    @Body() body: UploadImageDTO,
  ) {
    if (file) {
      return await this.uploadService.uploadImage(file, bucket, body);
    }
    return null;
  }

  @Delete('/all')
  async deleteAll() {
    return await this.uploadService.deleteAllImage();
  }
}
