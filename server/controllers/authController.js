const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

/**
 * Auth controller — Week 3 (Authentication & Authorization)
 *
 * Implements Tasks #1, #2, #3, #6, #9.
 *
 * Response shape is intentionally `{ token, user: { _id, name,
 * email, role } }` because the Week 4 React `authSlice` /
 * `authAPI.js` expect exactly that.
 */

// Build a safe user object — NEVER leak passwordHash to the client.
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Set the refresh token as an httpOnly cookie (Task #6).
const sendRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // not readable by JS — mitigates XSS token theft
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already registered' });
    }

    // We pass the plain password into `passwordHash`; the User model
    // pre-save hook bcrypt-hashes it before it is written to MongoDB.
    const user = await User.create({ name, email, passwordHash: password });

    const token = generateAccessToken(user._id);
    sendRefreshCookie(res, generateRefreshToken(user._id));

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('REGISTER ERROR >>>', err);   // add this line
    next(err);
  }
};

// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // passwordHash has `select: false`, so explicitly include it.
    const user = await User.findOne({ email }).select('+passwordHash');

    // Identical message whether the email or the password is wrong —
    // never reveal which, to slow credential-stuffing attacks.
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateAccessToken(user._id);
    sendRefreshCookie(res, generateRefreshToken(user._id));

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('LOGIN ERROR >>>', err);   // add this line
  }
};

// @desc    Get the logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (valid access token required)
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by the `protect` middleware.
    res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Issue a fresh access token using the refresh cookie
// @route   POST /api/auth/refresh
// @access  Public (needs a valid refresh cookie) — Task #6
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No refresh token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token invalid or expired — please log in again',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    res
      .status(200)
      .json({ success: true, token: generateAccessToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// @desc    Log out — clear the refresh cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};
