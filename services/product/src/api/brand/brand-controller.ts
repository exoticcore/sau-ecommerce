import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateBrandType, UpdateBrandType } from './brand-model';
import { extension } from 'mime-types';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import BrandService from './brand-service.js';
import { BadRequestError } from '../../error/bad-request.js';

const brandService = new BrandService();
// Get all brands
export const getAllBrands = async (req: Request, res: Response) => {
  const brands = await brandService.getAllBrands();
  if (brands.length <= 0)
    return res.status(StatusCodes.OK).json({ message: 'brand is empty' });

  return res.status(StatusCodes.OK).json(brands);
};

export const getBrandById = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const parseId = parseInt(brandId);
  if (!parseId) throw new BadRequestError('brand id should be number');

  const brand = await brandService.getBrandByID(parseId);
  if (!brand) throw new BadRequestError(`not found brand at id ${parseId}`);

  return res.status(StatusCodes.OK).json(brand);
};

// Read product by brand ID
export const getProductBrandD = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const parseId = parseInt(brandId);
  if (!parseId) throw new BadRequestError('brand id should be number');

  const brand = await brandService.getProductByBrandID(parseId);
  if (!brand) throw new BadRequestError('not found brand ');

  if (brand.products.length <= 0)
    return res
      .status(StatusCodes.OK)
      .json({ message: `empty product in this brand '${brand.name}'` });

  return res.status(StatusCodes.OK).json(brand.products);
};

// Create new brand
export const createBrand = async (req: Request, res: Response) => {
  const brandInfo: CreateBrandType = req.body;
  const file = req.file;
  const { sub } = res.locals.user;

  const isBrand = await brandService.getBrandByName(brandInfo.name);
  if (isBrand) throw new BadRequestError('brand name not available');

  let newFile: string | undefined;
  let params: PutObjectRequest | undefined;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${brandInfo.name.replace(' ', '_')}.${type}`;
    const path = `brand/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const created = await brandService.createBrand(
    brandInfo,
    <string>sub,
    newFile,
    params
  );

  return res.status(StatusCodes.CREATED).json(created);
};

// Update brand by ID
export const updateBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const { sub } = res.locals.user;
  const file = req.file;
  const brandInfo: UpdateBrandType = req.body;

  const parseId = parseInt(brandId);
  if (!parseId) throw new BadRequestError('brand id should be number');

  const isBrand = await brandService.getBrandByID(parseId);
  if (!isBrand) throw new BadRequestError('brand not found');

  if (brandInfo.name) {
    const nameCheck = await brandService.getBrandByName(brandInfo?.name);
    if (nameCheck && nameCheck.id !== parseId)
      throw new BadRequestError('brand name not available');
  }

  let params: PutObjectRequest | undefined;
  let newFile: string | undefined;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${
      brandInfo.name?.replace(' ', '_') || isBrand.name.replace(' ', '_')
    }.${type}`;
    const path = `brand/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const updated = await brandService.updateBrand(
    parseId,
    sub,
    brandInfo,
    newFile,
    params
  );

  return res.status(StatusCodes.OK).json(updated);
};

// Delete brand by ID
export const deleteBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const parseId = parseInt(brandId);
  if (!parseId) throw new BadRequestError('brand id should be number');

  const deleted = await brandService.deleteBrand(parseId);

  return res
    .status(StatusCodes.OK)
    .json({ message: `deleted brand name '${deleted.name}'` });
};
