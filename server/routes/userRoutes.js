const express = require('express');
const router  = express.Router();
const protect = require('../middleware/authMiddleware');
const c = require('../controllers/userController');

// All routes below require a valid JWT
router.use(protect);

router.put('/profile',  c.updateProfile);
router.put('/password', c.changePassword);

router.get('/addresses',                 c.listAddresses);
router.post('/addresses',                c.addAddress);
router.put('/addresses/:addressId',      c.updateAddress);
router.delete('/addresses/:addressId',   c.deleteAddress);

router.delete('/account', c.deleteAccount);

module.exports = router;

