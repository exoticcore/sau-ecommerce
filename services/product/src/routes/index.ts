import express from 'express';
import categoryRoute from '../api/category/category-route.js';
import brandRoute from '../api/brand/brand-route.js';
import productRoute from '../api/product/product-route.js';
import subcatRoute from '../api/subcat/subcat-route.js';

const router = express.Router();

export default (): express.Router => {
  router.use('/brand', brandRoute);
  router.use('/category', categoryRoute);
  router.use('/subcat', subcatRoute);
  router.use('/product', productRoute);

  return router;
};
