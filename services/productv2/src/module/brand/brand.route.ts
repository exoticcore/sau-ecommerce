import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBrandDto, UpdateBrandDto } from '@/module/brand/brand.dto';
import BrandController from '@/module/brand/brand.controller';
import authorizationMiddleware, { Roles } from '../../middlewares/authorization.middleware';

export default class BrandRoute implements Routes {
  public path = '/brand';
  public router = Router();

  private brand = new BrandController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.brand.readAllBrands);
    this.router.get(`${this.path}/:brandTitle`, this.brand.readBrandByTitle);
    this.router.post(
      `${this.path}`,
      authorizationMiddleware([Roles.ADMIN, Roles.MANAGER, Roles.USER]),
      ValidationMiddleware(CreateBrandDto),
      this.brand.createBrand,
    );
    this.router.patch(
      `${this.path}/:brandId`,
      authorizationMiddleware([Roles.ADMIN, Roles.MANAGER, Roles.USER]),
      ValidationMiddleware(UpdateBrandDto),
      this.brand.updateBrand,
    );
    this.router.delete(`${this.path}/:brandId`, authorizationMiddleware([Roles.ADMIN, Roles.MANAGER, Roles.USER]), this.brand.deleteBrand);
  }
}
