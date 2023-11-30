import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import Service from '../../utils/service.js';
import { CreateBrandType, UpdateBrandType } from './brand-model.js';
import { CustomAPIError } from '../../error/custom-error.js';

export default class BrandService extends Service {
  constructor() {
    super();
  }

  public async getAllBrands() {
    return await this.prisma.brand.findMany();
  }

  public async getBrandByID(brandId: number) {
    return await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });
  }

  public async getBrandByName(brandName: string) {
    return await this.prisma.brand.findUnique({
      where: {
        name: brandName,
      },
    });
  }

  public async getProductByBrandID(brandId: number) {
    return await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        products: true,
      },
    });
  }

  public async createBrand(
    brandInfo: CreateBrandType,
    creator: string,
    file?: string,
    params?: PutObjectRequest
  ) {
    if (params && file) {
      // upload file to s3 object
      await this.uploadObject(params);
      // produce event message through kafka meddia service
      await this.uploadImageProducer(params, brandInfo.name, file);
    }

    return await this.prisma.brand.create({
      data: {
        created_by: creator,
        image: params?.Key ? params.Key : null,
        name: brandInfo.name,
        description: brandInfo.description,
      },
    });
  }

  public async updateBrand(
    brandId: number,
    editor: string,
    brandInfo?: UpdateBrandType,
    file?: string,
    params?: PutObjectRequest
  ) {
    const oldBrand = await this.prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });
    if (!oldBrand) throw new CustomAPIError();

    if (params && file) {
      if (oldBrand.image) {
        // remove old file from s3
        await this.deleteObject(oldBrand.image);
        // send update event message producer
        await this.updateImageProducer(
          params,
          brandInfo?.name || oldBrand.name,
          file,
          oldBrand.image || undefined
        );
      } else {
        await this.uploadImageProducer(
          params,
          brandInfo?.name || oldBrand.name,
          file,
          false
        );
      }
      // upload file into s3
      await this.uploadObject(params);
    }

    return await this.prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name: brandInfo?.name ? brandInfo.name : oldBrand.name,
        image: params?.Key ? params.Key : oldBrand.image,
        description: brandInfo?.description
          ? brandInfo.description
          : oldBrand.description,
        edited_by: editor,
      },
    });
  }

  public async deleteBrand(brandId: number) {
    const deleted = await this.prisma.brand.delete({
      where: {
        id: brandId,
      },
    });

    if (deleted.image) {
      // remove file from s3
      await this.deleteObject(deleted.image);
      // send delete event message producer
      await this.deleteImageProducer(deleted.image);
    }

    return deleted;
  }
}
