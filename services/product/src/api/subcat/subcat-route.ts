import express from 'express';
import * as SubCatController from './subcat-controller.js';

const router = express.Router();

router.get('/', SubCatController.getAllSubCat);
router.post('/', SubCatController.createSubCat);
router.put('/:subCatId', SubCatController.updateSubCat);
router.delete('/:subCatId', SubCatController.deleteSubCat);

export default router;
