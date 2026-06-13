const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const c = require('../controllers/newsletterController');

router.post('/subscribe', c.subscribe);              // public
router.get('/subscribers', protect, admin, c.list);  // admin only

module.exports = router;