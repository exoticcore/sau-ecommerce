import express from 'express';
import categoryRoute from '../api/category/category-route.js';

const router = express.Router();

export default (): express.Router => {
  router.use('/category', categoryRoute);

  return router;
};
