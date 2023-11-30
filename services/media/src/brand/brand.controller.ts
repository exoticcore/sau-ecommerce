import { Controller } from '@nestjs/common';
import { BrandService } from './brand.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBrandDTO } from './dto/brand-message.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @MessagePattern('media.brand.create')
  async createBrand(@Payload() message: CreateBrandDTO) {
    await this.brandService.createBrandMedia(message);
  }
}
