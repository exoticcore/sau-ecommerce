import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { Readable } from 'stream';
import {
  DeleteCategoryType,
  UpdateCategoryType,
  UploadMessageType,
} from './dto/upload-message.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/role';
import { Role } from '../auth/role/role.enum';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // File Stream for Category media
  @HttpCode(HttpStatus.OK)
  @Get('/:file')
  async getCategoryImage(@Param('file') file: string, @Res() res: Response) {
    const image = await this.categoryService.getCategoryImage(file);

    if (!image) return { message: 'image not found' };

    const fileStream = Readable.from(<Buffer>image.Buffer);

    res.set({
      'Content-Type': image.content_type,
      'Content-Deisposition': `${encodeURI(image.title)}_${Date.now()}`,
    });

    return fileStream.pipe(res);
  }

  // Get Lists of all Category Images
  @Get()
  async getAllCategoryLists() {
    return await this.categoryService.getAllCategoryLists();
  }

  // Delete All Category Lists
  @Delete('/all')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAllCategoryImages() {
    return await this.categoryService.deleteAllImage();
  }

  // Mesage from product service for create category
  @MessagePattern('media.category.upload')
  async uploadCategory(
    @Payload() message: UploadMessageType,
    // @Ctx() context: KafkaContext,
  ) {
    // console.log(`partition: ${context.getPartition()}`);
    // console.log(`message: ${message}`);
    // console.log(message);
    console.log(message);
    await this.categoryService.uploadCategory(message);
  }

  @MessagePattern('media.category.update')
  async updateImage(@Payload() message: UpdateCategoryType) {
    // console.log(message);
    await this.categoryService.updateCategory(message);
  }

  @MessagePattern('media.category.delete')
  async deleteCategoryImage(@Payload() message: DeleteCategoryType) {
    // console.log(message);
    await this.categoryService.deleteCategoryByPath(message);
  }
}
