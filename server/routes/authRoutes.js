const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  validateRegister,
  validateLogin,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getMe);

module.exports = router;