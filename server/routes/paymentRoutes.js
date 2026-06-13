const express = require('express');
const router  = express.Router();
 
const {
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/paymentController');
 
const protect = require('../middleware/authMiddleware');
 
// Both routes require a logged-in user.
// NOTE: the webhook is NOT here — it is mounted directly in
// server.js because it needs the raw body, not parsed JSON.
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify',       protect, verifyPayment);
 
module.exports = router;

