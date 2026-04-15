const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  validateProduct,        // ← add this
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', validateProduct, createProduct);  // ← validateProduct added
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;