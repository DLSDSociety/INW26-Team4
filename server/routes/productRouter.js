const express = require('express');
const router = express.Router();
 
const {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
 
const protect = require('../middleware/authMiddleware');
const admin   = require('../middleware/adminMiddleware');
const upload  = require('../middleware/uploadMiddleware');
 
// Public routes
router.get('/',           getProducts);
router.get('/categories', getCategories);
router.get('/:id',        getProductById);
 
// Admin-only routes — note the upload.array() before controller
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 5),     // accept up to 5 images, field name 'images'
  createProduct
);
 
router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 5),
  updateProduct
);
 
router.delete('/:id', protect, admin, deleteProduct);
 
module.exports = router;

