import Service from '../../utils/service.js';
import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { CustomAPIError } from '../../error/custom-error.js';
import { CategoryType, UploadInfo } from './category-model.js';
import { BadRequestError } from '../../error/bad-request.js';

export default class CategoryService extends Service {
  constructor() {
    super();
  }

  // Read Category By ID Service
  async getCategoryByID(categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      return category;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  // Read Category By Title Service
  async getCategoryByTitle(title: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          title,
        },
      });
      return category;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  // Read ALl Categories from the Database
  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany({});
      return categories;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  // Create New Category Service
  async createCategory(
    categoryInfo: CategoryType,
    userId?: string | null,
    file?: string | null,
    params?: PutObjectRequest | null
  ) {
    try {
      if (params && file) {
        // upload file to s3 object
        await this.uploadObject(params);

        // produce event message through kafka media service
        await this.uploadImageProducer(params, categoryInfo.title, file, false);
      }
      const created = await this.prisma.category.create({
        data: {
          created_by: userId,
          image: params?.Key ? params.Key : null,
          ...categoryInfo,
        },
      });
      return created;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  // Update New category centent Service
  async updateCategory(
    categoryId: number,
    categoryInfo: CategoryType | null,
    userId?: string,
    file?: string,
    params?: PutObjectRequest
  ) {
    const category = await this.getCategoryByID(categoryId);
    if (!category)
      throw new BadRequestError(`not found category id ${categoryId}`);

    if (params && file) {
      // update new file into s3 object
      if (category.image) await this.deleteObject(category.image);

      await this.uploadObject(params);

      // produce update event message through kafka media service
      await this.updateImageProducer(
        params,
        categoryInfo?.title || category.title,
        file,
        category.image || undefined,
        false
      );
    }

    const updated = await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        edited_by: userId,
        title: categoryInfo?.title || category.title,
        description: categoryInfo?.description || category.description,
        image: params?.Key ? params.Key : category.image,
      },
    });

    return updated;
  }

  // Delete Category By Id
  async deleteCategory(categoryId: number) {
    try {
      const deleted = await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      if (deleted.image) {
        // Delete image from bucket
        await this.deleteObject(deleted.image);
        // Send delete event message through kafka media service
        await this.deleteImageProducer(deleted.image);
      }
      return deleted;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  // Delete All Categoris on Database, S3 Bucket
  async deleteAllCategories() {
    try {
      const deleted = await this.prisma.category.deleteMany();

      return deleted;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  async categoryUpdateFromMessage(catInfo: UploadInfo) {
    try {
      return await this.prisma.category.update({
        where: {
          id: catInfo.catId,
        },
        data: {
          image: catInfo.path,
        },
      });
    } catch (err) {
      throw new CustomAPIError();
    }
  }
}
