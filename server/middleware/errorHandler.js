/**
 * Central error handling — turns thrown errors into clean JSON.
 *
 * Express recognises a middleware with FOUR arguments
 * (err, req, res, next) as an error handler. It must be registered
 * AFTER all routes in server.js.
 */

// 404 handler — runs when no route matched the request.
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Global error handler.
const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  // Mongoose: bad ObjectId (e.g. /api/products/notavalidid)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((v) => v.message)
      .join(', ');
  }

  // Mongoose: duplicate key (e.g. duplicate email / duplicate review)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for unique field: ${field}`;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('🔴  Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
