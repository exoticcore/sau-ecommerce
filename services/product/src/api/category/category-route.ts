import express from 'express';
import * as CategoryController from './category-controller.js';
import authorization from '../../middleware/authorization.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getCategoryByID);
router.post(
  '/',
  authorization(['admin']),
  upload.single('media'),
  // validator(createCategoryValidate),
  CategoryController.createCategory
);
router.put(
  '/:categoryId',
  authorization(['admin']),
  upload.single('media'),
  // validator(createCategoryValidate),
  CategoryController.updateCategory
);
router.delete(
  '/:categoryId',
  authorization(['admin']),
  CategoryController.deleteCategory
);
router.delete(
  '/delete/all',
  authorization(['admin']),
  CategoryController.deleteAllCategory
);

export default router;
