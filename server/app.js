

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');
const paymentRouter = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();

app.set('trust proxy', 1);   // honour X-Forwarded-For from one proxy hop




// ── Core middleware (NO body parser yet) ────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true, // browser sends the refresh cookie
  })
);
app.use(cookieParser());

// ── Razorpay webhook — MUST come BEFORE express.json() ──────────
// Razorpay signs the RAW request bytes. If express.json() parses
// the body first, the recomputed signature can never match.
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  require('./controllers/paymentController').handleWebhook
);

// ── Body parsers (every route below gets parsed JSON) ───────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API is running 🚀',
  });
});

// ── Mount routers (ALL before notFound) ─────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);   // ← now reachable
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRouter'));        // ← add this
app.use('/api/users', userRoutes);                      // ← add this
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));



// ── Error handling (must be last) ───────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;