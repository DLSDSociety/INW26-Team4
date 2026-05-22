/**
 * adminMiddleware — Implementation Task #5 (Week 3)
 *
 * MUST run AFTER `protect`, because it relies on req.user being set.
 * Returns 403 Forbidden (authenticated but not allowed) — not 401.
 *
 * Usage in a router:
 *   router.post('/', protect, admin, createProduct);
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden — admin access required',
  });
};

module.exports = admin;
