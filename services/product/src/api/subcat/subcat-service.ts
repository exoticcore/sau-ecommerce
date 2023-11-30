import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { CustomAPIError } from '../../error/custom-error.js';
import Service from '../../utils/service.js';
import { SubCatCreateType, SubCatUpdateType } from './subcat-model.js';

export default class SubCatService extends Service {
  constructor() {
    super();
  }

  async getSubCatByTitle(subCatTitle: string) {
    return await this.prisma.subCategory.findUnique({
      where: {
        title: subCatTitle,
      },
    });
  }

  async getSubCatById(subCatId: number) {
    return await this.prisma.subCategory.findUnique({
      where: {
        id: subCatId,
      },
    });
  }

  async getAllSubCats() {
    return await this.prisma.subCategory.findMany();
  }

  async createSubCat(
    subCatInfo: SubCatCreateType,
    creator: string,
    params?: PutObjectRequest,
    file?: string
  ) {
    if (params && file) {
      await this.uploadObject(params);
      await this.uploadImageProducer(params, subCatInfo.title, file);
    }

    return await this.prisma.subCategory.create({
      data: {
        created_by: creator,
        image: params?.Key || undefined,
        title: subCatInfo.title,
        description: subCatInfo.description,
        category_id: subCatInfo.category_id,
      },
    });
  }

  async updateSubCat(
    subCatInfo: SubCatUpdateType,
    subCatId: number,
    editor: string,
    params?: PutObjectRequest,
    file?: string
  ) {
    const subCat = await this.prisma.subCategory.findUnique({
      where: { id: subCatId },
    });
    if (!subCat) throw new CustomAPIError();

    if (params && file) {
      if (subCat.image) {
        await this.deleteObject(subCat.image);
        await this.updateImageProducer(
          params,
          subCatInfo.title || subCat.title,
          file,
          subCat.image || undefined
        );
      } else {
        await this.uploadImageProducer(
          params,
          subCatInfo.title || subCat.title,
          file
        );
      }
      await this.uploadObject(params);
    }

    return await this.prisma.subCategory.update({
      where: {
        id: subCat.id,
      },
      data: {
        title: subCatInfo.title || subCat.title,
        category_id: subCatInfo.category_id || subCat.category_id,
        description: subCatInfo.description || subCat.description,
        image: params?.Key || subCat.image,
        edited_by: editor,
      },
    });
  }

  async deleteSubCat(subCatId: number) {
    return await this.prisma.subCategory.delete({
      where: {
        id: subCatId,
      },
    });
  }
}
