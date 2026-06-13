const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  refresh,
  logout,
} = require('../controllers/authController');
const {
  validate,
  registerRules,
  loginRules,
} = require('../middleware/validators');
const protect = require('../middleware/authMiddleware');
/**
 * Auth routes — UPDATED for Week 3.
 *
 * Week 2 returned 501 placeholders. Week 3 wires the real
 * controller, validation, and JWT protection.
 *
 * Base path (mounted in app.js): /api/auth
 */

router.post('/register', registerRules, validate, register); // Task #1
router.post('/login', loginRules, validate, login); //           Task #2
router.get('/me', protect, getMe); //                            Task #3
router.post('/refresh', refresh); //                             Task #6
router.post('/logout', logout);

module.exports = router;
