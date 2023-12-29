import { NextFunction, Request, Response } from 'express';
import BrandService from './brand.service';
import { HttpException } from '@exceptions/httpException';
import { CreateBrandDto, UpdateBrandDto } from '@brand/brand.dto';
const brandService = new BrandService();

export default class BrandController {
  public async readAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.readAllBrands();
      if (brands.length <= 0) throw new HttpException(404, 'Brands not found');

      return res.status(200).json(brands);
    } catch (err) {
      next(err);
    }
  }

  public async readBrandByTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandTitle } = req.params;
      const brand = await brandService.getBrandByTitle(brandTitle);
      if (!brand) throw new HttpException(409, 'Brands not exists');

      return res.status(200).json(brand);
    } catch (err) {
      next(err);
    }
  }

  public async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandInfo: CreateBrandDto = req.body;
      const createdBrand = await brandService.createBrand(brandInfo);
      if (!createdBrand) throw new HttpException(409, 'Brand creation error');

      return res.status(201).json(createdBrand);
    } catch (err) {
      next(err);
    }
  }

  public async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandId = parseInt(req.params.brandId);
      const brandUpdateInfo: UpdateBrandDto = req.body;
      if (!brandId) throw new HttpException(400, 'Bad request error');

      const updatedBrand = await brandService.updateBrand(brandId, brandUpdateInfo);
      if (!updatedBrand) throw new HttpException(409, 'Bran');

      return res.status(200).json(updatedBrand);
    } catch (err) {
      next(err);
    }
  }

  public async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brandId = parseInt(req.params.brandId);
      if (!brandId) throw new HttpException(400, 'Bad request error');

      const deletedBrand = await brandService.deleteBrand(brandId);
      if (!deletedBrand) throw new HttpException(409, 'Deleted brand has problem');

      return res.status(204).json(deletedBrand);
    } catch (err) {
      next(err);
    }
  }
}
