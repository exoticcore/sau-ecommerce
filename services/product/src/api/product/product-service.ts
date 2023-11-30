import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import Service from '../../utils/service.js';
import {
  CreateColor,
  CreateImagesProduct,
  CreateProductType,
  UpdateProductType,
} from './product-model.js';

export default class ProductService extends Service {
  constructor() {
    super();
  }

  async readAllProducts() {
    return await this.prisma.product.findMany();
  }

  async readProductByID(productID: number) {
    return await this.prisma.product.findUnique({
      where: {
        id: productID,
      },
    });
  }

  async readProductByName(productName: string) {
    return await this.prisma.product.findUnique({
      where: {
        name: productName,
      },
      include: {
        images: true,
        colors: true,
      },
    });
  }

  async createProduct(
    productInfo: CreateProductType,
    creator: string,
    media?: string[],
    params?: PutObjectRequest[],
    subCatId?: number[],
    colorImages?: string[]
  ) {
    const createdProduct = await this.prisma.product.create({
      data: {
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        created_by: creator,
      },
    });

    if (productInfo.colors && productInfo.colors.length > 0) {
      productInfo.colors.map(async (color) => {
        if (!color.image_name) {
          await this.prisma.color.create({
            data: {
              title: color.title,
              add_price: color.add_price || 0,
              description: color.description || null,
              product_id: createdProduct.id,
            },
          });
        }
      });
    }

    if (subCatId && subCatId.length > 0) {
      subCatId.map(async (subCatID) => {
        await this.prisma.subCategoriesProducts.create({
          data: {
            product_id: createdProduct.id,
            sub_category_id: subCatID,
          },
        });
      });
    }

    if (media && media.length > 0 && params && params.length > 0) {
      for (let i = 0; i >= media.length; i++) {
        await this.uploadObject(params[i]);
        await this.uploadImageProducer(params[i], productInfo.name, media[i]);
        await this.prisma.imagesProduct.create({
          data: {
            title: media[i],
            url: params[i].Key,
            product_id: createdProduct.id,
          },
        });
      }
    }
  }

  async updateProduct(productID: number, productInfo: UpdateProductType) {
    return await this.prisma.product.update({
      where: {
        id: productID,
      },
      data: {
        ...productInfo,
      },
    });
  }

  async deleteProduct(productID: number) {
    return await this.prisma.product.delete({
      where: {
        id: productID,
      },
    });
  }
}
