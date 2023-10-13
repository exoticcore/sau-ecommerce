import express from 'express';
import * as CategoryController from './category-controller.js';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);

export default router;
