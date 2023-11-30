import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Readable } from 'stream';
import { Response } from 'express';
import {
  DeleteMessageType,
  UpdateMessageType,
  UploadMessageType,
} from './dto/image-message.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/:key/:file')
  async getPublicImage(
    @Param('key') key: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    const image = await this.imageService.getPublicImage(key, file);

    const fileStream = Readable.from(<Buffer>image.Buffer);
    res.set({
      'Content-Type': image.content_type,
      'Content-Deisposition': `${encodeURI(image.title)}_${Date.now()}`,
    });

    return fileStream.pipe(res);
  }

  @Get('/all')
  async getAllImagesList() {
    const images = await this.imageService.getAllImagesList();
    return images;
  }

  @Delete('/all')
  async deleteAllImage() {
    const deleted = await this.imageService.deleteAllImages();
    return deleted;
  }

  // Upload event message
  @MessagePattern('media.image.upload')
  async uploadImage(@Payload() message: UploadMessageType) {
    await this.imageService.uploadImage(message);
    console.log(message);
  }

  // Update event message
  @MessagePattern('media.image.update')
  async updateImage(@Payload() message: UpdateMessageType) {
    await this.imageService.updateImage(message);
    console.log(message);
  }

  // Delete event message
  @MessagePattern('media.image.delete')
  async deleteImage(@Payload() message: DeleteMessageType) {
    await this.imageService.deleteImage(message);
    console.log(message);
  }
}
