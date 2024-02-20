import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { UploadBrandDto } from './brand.dto';
import { AmqpService } from '../../../core/provider/amqp/amqp.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly amqpService: AmqpService,
  ) {}

  async getBrandByTitle(brandTitle: string) {
    const brand = await this.brandRepository.findOneBy({ brandTitle });
    return brand;
  }

  async getBrandByFile(filename: string) {
    const brand = await this.brandRepository.findOneBy({ imageName: filename });
    return brand;
  }

  async createBrand(
    uploadBrandDto: UploadBrandDto,
    imageName: string,
    path: string,
  ) {
    const newBrand = this.brandRepository.create({
      brandTitle: uploadBrandDto.brandTitle,
      imageName: imageName,
      path: path,
    });
    await this.amqpService.channelWrapper.publish(
      'media_exchange',
      'product.media.brand.create',
      Buffer.from(JSON.stringify(newBrand)),
    );

    return await this.brandRepository.save(newBrand);
  }

  async updateBrand(uploadBrandDto: UploadBrandDto) {
    const brand = await this.getBrandByTitle(uploadBrandDto.brandTitle);
    brand.brandTitle = uploadBrandDto.brandTitle || brand.brandTitle;

    await this.brandRepository.save(brand);
    return brand;
  }

  async deleteBrand(brandTitle: string) {
    const brandMedia = await this.getBrandByTitle(brandTitle);

    const deleted = await this.brandRepository.delete({
      brandTitle: brandTitle,
    });

    await this.amqpService.channelWrapper.publish(
      'media_exchange',
      'product.media.brand.delete',
      Buffer.from(JSON.stringify(brandMedia)),
    );

    return deleted;
  }
}
