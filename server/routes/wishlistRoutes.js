const express = require('express');
const router  = express.Router();
const protect  = require('../middleware/authMiddleware');
const c = require('../controllers/wishlistController');
 
router.use(protect);                                  // all routes require JWT
 
router.get('/',               c.getWishlist);         // GET    /api/wishlist
router.post('/:productId',    c.addToWishlist);       // POST   /api/wishlist/:id
router.delete('/:productId',  c.removeFromWishlist);  // DELETE /api/wishlist/:id
router.delete('/',            c.clearWishlist);       // DELETE /api/wishlist
 
module.exports = router;

