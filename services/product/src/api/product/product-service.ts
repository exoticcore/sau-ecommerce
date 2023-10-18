import Service from '../../utils/service';
import {
  CreateColor,
  CreateImagesProduct,
  CreateProductType,
  UpdateProductType,
} from './product-model';

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
    imageProduct: CreateImagesProduct,
    colors: CreateColor
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: { ...productInfo },
      });
      const productImage = await prisma.imagesProduct.create({
        data: {
          product_id: product.id,
          ...imageProduct,
        },
      });
      const color = await prisma.color.create({
        data: {
          product_id: product.id,
          ...colors,
        },
      });
      return { product, productImage, color };
    });
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
