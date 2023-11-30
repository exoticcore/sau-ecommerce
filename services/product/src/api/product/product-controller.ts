import { Request, Response } from 'express';
import { CreateProductType, UpdateProductType } from './product-model.js';
import { StatusCodes } from 'http-status-codes';
import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { extension } from 'mime-types';
import * as CustomError from '../../error/index.js';

import ProductService from './product-service.js';
const productService = new ProductService();

// Read All Products
export const readAllProducts = async (req: Request, res: Response) => {
  const products = await productService.readAllProducts();

  if (products.length <= 0)
    res.status(StatusCodes.OK).json({ message: 'product is empty' });

  res.status(StatusCodes.OK).json(products);
};

// Read Product By Title
export const readProductByTitle = async (req: Request, res: Response) => {
  const productName: string = req.params.name;
  const product = await productService.readProductByName(productName);

  if (!product) throw new CustomError.BadRequestError('product not found');

  return res.status(StatusCodes.OK).json(product);
};

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  const productInfo: CreateProductType = req.body;
  const { sub } = res.locals.user;
  const files = <Express.Multer.File[] | undefined>req.files;

  const isProduct = await productService.readProductByName(productInfo.name);
  if (isProduct)
    throw new CustomError.BadRequestError('product name not available');

  let newFile: string[] = [];
  let params: PutObjectRequest[] = [];
  let colorImages: string[];
  if (files) {
    for (let i = 0; i >= files.length; i++) {
      const file = files[i];
      const type = extension(file.mimetype);
      newFile[i] = `${productInfo.name.replace(' ', '_')}_${1 + i}.${type}`;
      const path = `product/${newFile[i]}`;
      params[i] = {
        Bucket: <string>process.env.S3_BUCKET,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      if (productInfo.colors && productInfo.colors.length > 0) {
        productInfo.colors.map((color) => {
          if (color.image_name === file.filename) {
            colorImages[i] = path;
          }
        });
      }
    }
  }

  const created = await productService.createProduct(
    productInfo,
    sub,
    newFile,
    params
  );

  return res.status(StatusCodes.CREATED).json(created);
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const productInfo: UpdateProductType = req.body;
  const productID: number = parseInt(id);

  if (typeof productID !== 'number')
    throw new CustomError.BadRequestError('invalid id');

  const product = await productService.readProductByID(productID);
  if (!product)
    throw new CustomError.BadRequestError(
      `not found product at id ${productID}`
    );

  const updated = await productService.updateProduct(productID, productInfo);
  return res.status(StatusCodes.OK).json(updated);
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const productID = parseInt(id);

  if (typeof productID !== 'number')
    throw new CustomError.BadRequestError('invalid id');

  const product = await productService.readProductByID(productID);
  if (!product)
    throw new CustomError.BadRequestError(
      `not found product at id ${productID}`
    );

  const deleted = await productService.deleteProduct(productID);

  res.status(StatusCodes.OK).json(deleted);
};
