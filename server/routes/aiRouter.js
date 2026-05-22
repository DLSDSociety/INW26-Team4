const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');   // ← destructure
const router = express.Router();

const optionalAuth = require('../middleware/optionalAuth');
const { chat, feedback } = require('../controllers/aiController');

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.user?._id
      ? `u:${req.user._id}`
      : `ip:${ipKeyGenerator(req)}`,                                   // ← use helper
  message: { message: 'Too many requests. Please slow down and try again later.' },
});

router.post('/chat', optionalAuth, chatLimiter, chat);
router.post('/feedback', optionalAuth, feedback);

module.exports = router;