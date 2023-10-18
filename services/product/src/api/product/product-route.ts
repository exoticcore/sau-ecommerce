import express from 'express';
import * as ProductController from './product-controller.js';

const router = express.Router();

router.get('/', ProductController.readAllProducts);
router.get('/:name', ProductController.readProductByTitle);
router.post('/', ProductController.createProduct);
router.put('/:id');
router.delete('/:id', ProductController.deleteProduct);

export default router;
