import { CustomAPIError } from '../../error/custom-error.js';
import Service from '../../utils/service.js';
import { CategoryType } from './category-model.js';

export default class CategoryService extends Service {
  constructor() {
    super();
  }

  async getCategoryByID(categoryId: number) {
    const cacheCategories = await this.redisGet(`cat_id_${categoryId}`);
    if (cacheCategories) return cacheCategories;
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    await this.redisSet(`cat_id_${categoryId}`, category);
    return category;
  }

  async getCategoryByName(title: string) {
    const cacheCategory = await this.redisGet(`cat_name_${title}`);
    if (cacheCategory) return cacheCategory;
    const category = await this.prisma.category.findUnique({
      where: {
        title,
      },
    });
    await this.redisSet(`cat_${title}`, category);
    return category;
  }

  async getAllCategories() {
    try {
      const cacheCategories = await this.redisGet('get_all');
      if (cacheCategories) return cacheCategories;

      const categories = await this.prisma.category.findMany({});

      await this.redisSet('get_all', categories);

      return categories;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  async createCategory(
    categoryInfo: CategoryType,
    userId?: string | null,
    imageName?: string
  ) {
    try {
      const created = await this.prisma.category.create({
        data: {
          created_by: userId,
          image: imageName ? `category/${imageName}` : null,
          ...categoryInfo,
        },
      });
      return created;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  async updateCategory(
    categoryId: number,
    categoryInfo: CategoryType,
    userId?: string | null
  ) {
    try {
      const updated = await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          edited_by: userId,
          ...categoryInfo,
        },
      });
      await this.redisSet(`cat_id_${updated.id}`, updated);
      await this.redisSet(`cat_id_${updated.title}`, updated);
      return updated;
    } catch (err) {
      throw new CustomAPIError();
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      const deleted = await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return deleted;
    } catch (err) {
      throw new CustomAPIError();
    }
  }
}
