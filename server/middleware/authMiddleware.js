const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authMiddleware (protect) — Implementation Task #4 & #9 (Week 3)
 *
 * Verifies the JWT access token from the Authorization header,
 * loads the user, and attaches it to req.user so downstream
 * handlers know who is making the request.
 *
 * Task #9: token-expiry errors return a clean 401 (not a 500).
 */
const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Task #9 — distinguish expiry from a malformed/forged token.
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired — please log in again',
        });
      }
      return res
        .status(401)
        .json({ success: false, message: 'Token is invalid' });
    }

    // passwordHash is select:false so it is never loaded here.
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user for this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = protect;