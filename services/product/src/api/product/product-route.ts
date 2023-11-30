import express from 'express';
import * as ProductController from './product-controller.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/', ProductController.readAllProducts);
router.get('/:productName', ProductController.readProductByTitle);
router.post('/', upload.array('media'), ProductController.createProduct);
router.put(
  '/:productId',
  upload.array('media'),
  ProductController.updateProduct
);
router.delete('/:productId', ProductController.deleteProduct);

export default router;
