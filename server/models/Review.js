const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);


// ============================================================
// ONE REVIEW PER USER PER PRODUCT
// ============================================================

reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);


// ============================================================
// STATIC METHOD:
// RECALCULATE PRODUCT RATING + REVIEW COUNT
// ============================================================

reviewSchema.statics.recalcProductRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },

    {
      $group: {
        _id: '$product',

        avgRating: {
          $avg: '$rating',
        },

        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // If reviews exist
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, // 1 decimal
      numReviews: stats[0].count,
    });
  }

  // If all reviews deleted
  else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};


// ============================================================
// AFTER SAVE
// Recalculate product rating after create/update
// ============================================================

reviewSchema.post('save', async function () {
  await this.constructor.recalcProductRating(this.product);
});


// ============================================================
// BEFORE document.deleteOne()
// Store productId before deletion
// ============================================================

reviewSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    this._productId = this.product;
  }
);


// ============================================================
// AFTER document.deleteOne()
// Recalculate product rating
// ============================================================

reviewSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.constructor.recalcProductRating(this._productId);
  }
);


// ============================================================
// AFTER findOneAndDelete()
// Covers findByIdAndDelete() too
// ============================================================

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.recalcProductRating(doc.product);
  }
});


// ============================================================
// EXPORT MODEL
// ============================================================

module.exports = mongoose.model('Review', reviewSchema);