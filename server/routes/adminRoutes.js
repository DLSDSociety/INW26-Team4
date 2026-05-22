const express = require('express');

const router = express.Router();


// ============================================================
// CONTROLLERS
// ============================================================

const {
  getStats,
  getSalesChart,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} = require('../controllers/adminController');


// ============================================================
// MIDDLEWARE
// ============================================================

const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');


// ============================================================
// GLOBAL ADMIN GUARD
// Every route below requires:
// 1. Logged-in user
// 2. Admin role
// ============================================================

router.use(protect, admin);



// ============================================================
// DASHBOARD STATS
// GET /api/admin/stats
// ============================================================

router.get(
  '/stats',
  getStats
);



// ============================================================
// SALES CHART DATA
// GET /api/admin/sales-chart?days=30
// ============================================================

router.get(
  '/sales-chart',
  getSalesChart
);



// ============================================================
// GET ALL ORDERS
// GET /api/admin/orders
//
// Query Params:
// ?status=processing
// ?page=1
// ?limit=20
// ============================================================

router.get(
  '/orders',
  getAllOrders
);



// ============================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id
// ============================================================

router.patch(
  '/orders/:id',
  updateOrderStatus
);



// ============================================================
// GET ALL USERS
// GET /api/admin/users
// ============================================================

router.get(
  '/users',
  getAllUsers
);



// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;