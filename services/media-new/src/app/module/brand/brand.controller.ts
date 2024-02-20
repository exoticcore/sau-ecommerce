import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BrandService } from './brand.service';
import { UploadBrandDto } from './brand.dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { extension } from 'mime-types';
import { HttpExceptionFilter } from '../../../core/filter/http-exception.filter';
import { join } from 'path';
import { Readable } from 'stream';
import { readFile } from 'fs/promises';
import { Roles } from '../../../core/guard/role/role';
import { Role } from '../../../core/guard/role/role.enum';
import { AuthGuard } from '../../../core/guard/auth/auth.guard';
import { RolesGuard } from '../../../core/guard/role/role.guard';

@ApiTags('Brand')
@UseFilters(HttpExceptionFilter)
@Controller('/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // get brand image
  @HttpCode(HttpStatus.OK)
  @Get('/:file')
  @ApiResponse({
    status: 200,
    description: 'Stream brand image file successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getBrandImage(@Param('file') file: string, @Res() res: Response) {
    const brand = await this.brandService.getBrandByFile(file);
    if (!brand)
      throw new HttpException('Bad request error', HttpStatus.BAD_REQUEST);

    const fileBase64 = await readFile(
      join(process.cwd(), brand.path),
      'base64',
    );
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const fileStream = Readable.from(fileBuffer);
    res.set({
      'Content-Type': 'image/png',
      'Content-Deisposition': `${brand.brandTitle}_${Date.now()}`,
    });
    return fileStream.pipe(res);
  }

  // upload brand image
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @ApiResponse({ status: 201, description: 'Upload brand image successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    type: UploadBrandDto,
    description: 'JSON structure for brand object',
  })
  async uploadBrandImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/png' || 'image/jpg' || 'image/jpeg',
        })
        .build({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR }),
    )
    file: Express.Multer.File,
    @Body() uploadBrandDto: UploadBrandDto,
  ) {
    const dir = `upload/brand`;
    const fileType = extension(file.mimetype);
    const fileName = `${uploadBrandDto.brandTitle.toLowerCase()}.${fileType}`;
    const filePath = `${dir}/${fileName}`;

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (fileType) {
      writeFileSync(filePath, file.buffer);
    }

    const isBrand = await this.brandService.getBrandByTitle(
      uploadBrandDto.brandTitle,
    );
    if (isBrand)
      throw new HttpException(
        'brand title has been created',
        HttpStatus.BAD_REQUEST,
      );

    const created = await this.brandService.createBrand(
      uploadBrandDto,
      fileName,
      filePath,
    );
    created.id = undefined;

    return { created };
  }

  // update brand media
  @HttpCode(HttpStatus.OK)
  @Patch('/:brandTitle')
  @UseInterceptors(FileInterceptor('picture'))
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Update brand info successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request error',
  })
  async updateBrandMedia(
    @Param('brandTitle') brandTitle: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const brand = await this.brandService.getBrandByTitle(brandTitle);
    if (!brand)
      throw new HttpException('Bad request error', HttpStatus.BAD_REQUEST);

    if (file) {
    }

    return { message: 'updated brand' };
  }

  // delete brand media
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:brandTitle')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted brand media successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request error',
  })
  async deleteBrandMedia(@Param('brandTitle') brandTitle: string) {
    const isBrand = await this.brandService.getBrandByTitle(brandTitle);
    if (!isBrand)
      throw new HttpException('bad request error', HttpStatus.BAD_REQUEST);

    await this.brandService.deleteBrand(isBrand.brandTitle);

    unlinkSync(isBrand.path);

    return { message: `deleted brand title: '${brandTitle}'` };
  }
}
