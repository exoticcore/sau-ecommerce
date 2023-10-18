import { Controller, Delete } from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { extension } from 'mime-types';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { UploadMessageType } from './dto';

@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @MessagePattern('media.upload')
  upload(@Payload() message: UploadMessageType, @Ctx() context: KafkaContext) {
    // let success = false;
    // console.log(`topic: ${context.getTopic()}`);
    // console.log(`partition: ${context.getPartition()}`);

    const partition = context.getPartition();

    if (partition === 0) this.uploadService.uploadImage(message);

    // console.log(message);

    const type = extension(message.file.mimetype);
    const dir = `upload/${message.bucket}`;
    const file = `${message.title}.${type}`;
    const path = `${dir}/${file}`;
    const buffer = message.file.buffer;

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (type) {
      writeFileSync(path, buffer);
    }

    return { recieved: message };
  }

  @Delete('/all')
  async deleteAll() {
    return await this.uploadService.deleteAllImage();
  }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('/image/:bucket')
  // @UseInterceptors(FileInterceptor('picture'))
  // async uploadImage(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'image/png' || 'image/jpg' || 'image/jpeg',
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       }),
  //   )
  //   file: Express.Multer.File,
  //   @Param('bucket') bucket: string,
  //   @Body() body: UploadImageDTO,
  // ) {
  //   if (file) {
  //     return await this.uploadService.uploadImage(file, bucket, body);
  //   }
  //   return null;
  // }
}
