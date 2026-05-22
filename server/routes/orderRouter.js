
const express = require('express');
const router  = express.Router();
 
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
 
const protect = require('../middleware/authMiddleware');
 
// Every order route requires a logged-in user
router.post('/',            protect, createOrder);
router.get('/my-orders',    protect, getMyOrders);
router.get('/:id',          protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);
 
module.exports = router;

