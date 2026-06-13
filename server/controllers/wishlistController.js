const User    = require('../models/User');
const Product = require('../models/Product');
 
// ────────────────────────────────────────────────
// GET /api/wishlist           (protect)
// Returns the user's wishlist with full product details.
// ────────────────────────────────────────────────
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        select: 'name price images stock rating numReviews category',
      });
 
    if (!user) return res.status(404).json({ message: 'User not found' });
 
    // Filter out any wishlisted products that have since been deleted.
    // populate() returns null for missing refs — strip them so the
    // frontend never has to think about it.
    const items = (user.wishlist || []).filter(Boolean);
    res.json({ items, count: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ────────────────────────────────────────────────
// POST /api/wishlist/:productId   (protect)
// Idempotent: hearting twice is a no-op, not an error.
// ────────────────────────────────────────────────
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
 
    // Make sure the product actually exists before we save its ID.
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
 
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },   // set semantics → no dupes
    );
 
    res.status(200).json({ message: 'Added to wishlist', productId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ────────────────────────────────────────────────
// DELETE /api/wishlist/:productId   (protect)
// Safe to call on an ID that isn't in the wishlist.
// ────────────────────────────────────────────────
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
 
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
    );
 
    res.status(200).json({ message: 'Removed from wishlist', productId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ────────────────────────────────────────────────
// DELETE /api/wishlist             (protect)
// Empty the wishlist entirely.
// ────────────────────────────────────────────────
exports.clearWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { wishlist: [] } },
    );
 
    res.status(200).json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

