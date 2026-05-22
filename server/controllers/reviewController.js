const Review = require('../models/Review');
const Order = require('../models/Order');


// ============================================================
// CREATE REVIEW
// POST /api/reviews
// Private (Logged-in users only)
//
// Body:
// {
//   product,
//   rating,
//   comment
// }
//
// RULE:
// User must have purchased the product
// AND paid for the order
// ============================================================

exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!product || !rating || !comment) {
      return res.status(400).json({
        message: 'product, rating and comment are required',
      });
    }

    // --------------------------------------------------------
    // Check if user purchased this product
    // --------------------------------------------------------

    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': product,
      isPaid: true,
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: 'You can only review products you have purchased',
      });
    }

    // --------------------------------------------------------
    // Create Review
    // --------------------------------------------------------

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.status(201).json(review);

  } catch (err) {

    // --------------------------------------------------------
    // Duplicate review protection
    // Triggered by compound unique index
    // --------------------------------------------------------

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'You have already reviewed this product',
      });
    }

    res.status(400).json({
      message: err.message,
    });
  }
};



// ============================================================
// GET PRODUCT REVIEWS
// GET /api/reviews/product/:id
// Public Route
//
// Query Params:
// ?page=1
// ?limit=5
// ============================================================

exports.getProductReviews = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Pagination
    // --------------------------------------------------------

    const page = Math.max(1, Number(req.query.page) || 1);

    const limit = Math.min(
      20,
      Math.max(1, Number(req.query.limit) || 5)
    );

    const skip = (page - 1) * limit;

    // --------------------------------------------------------
    // Filter
    // --------------------------------------------------------

    const filter = {
      product: req.params.id,
    };

    // --------------------------------------------------------
    // Fetch reviews + total count
    // --------------------------------------------------------

    const [total, reviews] = await Promise.all([

      Review.countDocuments(filter),

      Review.find(filter)
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

    ]);

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      reviews,
      page,
      pages: Math.ceil(total / limit),
      total,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



// ============================================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// Private Route
//
// Allowed:
// - Review owner
// - Admin
//
// Uses findOneAndDelete so Mongoose middleware fires
// and product ratings recalculate automatically
// ============================================================

exports.deleteReview = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Find review
    // --------------------------------------------------------

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // --------------------------------------------------------
    // Authorization
    // --------------------------------------------------------

    const isOwner =
      review.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    // --------------------------------------------------------
    // Delete review
    // IMPORTANT:
    // findOneAndDelete triggers middleware hooks
    // --------------------------------------------------------

    await Review.findOneAndDelete({
      _id: review._id,
    });

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      message: 'Review removed',
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};