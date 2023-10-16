import express from 'express';
import * as CategoryController from './category-controller.js';
import validator from '../../middleware/validator.js';
import authorization from '../../middleware/authorization.js';
import { createCategoryValidate } from './category-model.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getCategoryByID);
router.post(
  '/',
  authorization(['admin']),
  upload.single('picture'),
  // validator(createCategoryValidate),
  CategoryController.createCategory
);
router.put(
  '/:categoryId',
  authorization(['admin']),
  validator(createCategoryValidate),
  CategoryController.updateCategory
);
router.delete(
  '/:categoryId',
  authorization(['admin']),
  CategoryController.deleteCategory
);

export default router;
