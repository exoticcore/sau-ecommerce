import { Request, Response } from 'express';
import { CreateProductType, UpdateProductType } from './product-model';
import ProductService from './product-service';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../error/bad-request';

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

  if (!product) throw new BadRequestError('product not found');

  return res.status(StatusCodes.OK).json(product);
};

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  const productInfo: CreateProductType = req.body;
  const { sub } = res.locals.user;

  return res.status(StatusCodes.CREATED).json();
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const productInfo: UpdateProductType = req.body;
  const productID: number = parseInt(id);

  if (typeof productID !== 'number') throw new BadRequestError('invalid id');

  const product = await productService.readProductByID(productID);
  if (!product)
    throw new BadRequestError(`not found product at id ${productID}`);

  const updated = await productService.updateProduct(productID, productInfo);
  return res.status(StatusCodes.OK).json(updated);
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const productID = parseInt(id);

  if (typeof productID !== 'number') throw new BadRequestError('invalid id');

  const product = await productService.readProductByID(productID);
  if (!product)
    throw new BadRequestError(`not found product at id ${productID}`);

  const deleted = await productService.deleteProduct(productID);

  res.status(StatusCodes.OK).json(deleted);
};
