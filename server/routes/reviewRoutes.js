const express = require('express');

const router = express.Router();


// ============================================================
// CONTROLLERS
// ============================================================

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');


// ============================================================
// MIDDLEWARE
// ============================================================

const protect = require('../middleware/authMiddleware');


// ============================================================
// ROUTES
// ============================================================


// ------------------------------------------------------------
// CREATE REVIEW
// POST /api/reviews
// Private Route
// ------------------------------------------------------------

router.post(
  '/',
  protect,
  createReview
);


// ------------------------------------------------------------
// GET PRODUCT REVIEWS
// GET /api/reviews/product/:id
// Public Route
// ------------------------------------------------------------

router.get(
  '/product/:id',
  getProductReviews
);


// ------------------------------------------------------------
// DELETE REVIEW
// DELETE /api/reviews/:id
// Private Route
// ------------------------------------------------------------

router.delete(
  '/:id',
  protect,
  deleteReview
);


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;