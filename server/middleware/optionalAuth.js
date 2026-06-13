// ───────────────────────────────────────────────────────────────
// middleware/optionalAuth.js
//
// Your existing authMiddleware ("protect") REJECTS requests with no
// token. The AI chat route is different: guests are allowed to ask
// product / FAQ questions, but order-tracking needs a logged-in user.
//
// This middleware decodes the JWT IF one is present and attaches
// req.user, but never blocks the request. The order-intent handler
// then decides whether req.user exists.
//
// It mirrors the decode logic in your Week 3 authMiddleware. If your
// token payload uses a different field, adjust the line marked below.
// ───────────────────────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Week 3 typically signs { id }. Some setups use _id — handle both.
      const userId = decoded.id || decoded._id;
      const user = await User.findById(userId).select('-password');
      if (user) req.user = user;
    }
  } catch (_) {
    // Invalid/expired token → treat as a guest. Do NOT throw.
  }
  next();
};
