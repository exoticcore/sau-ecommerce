import express from 'express';
import upload from '../../middleware/upload.js';
import authorization from '../../middleware/authorization.js';
import * as BrandController from './brand-controller.js';

const router = express.Router();

router.get('/', BrandController.getAllBrands);
router.get('/:brandId', BrandController.getProductBrandD);
router.post(
  '/',
  authorization(['admin']),
  upload.single('media'),
  BrandController.createBrand
);
router.put(
  '/:brandId',
  authorization(['admin']),
  upload.single('media'),
  BrandController.updateBrand
);
router.delete(
  '/:brandId',
  authorization(['admin']),
  BrandController.deleteBrand
);

export default router;
