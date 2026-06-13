const crypto   = require('crypto');
const razorpay = require('../config/razorpay');
const Order    = require('../models/Order');
 
// ───────────────────────────────────────────────────────────
// POST /api/payment/create-order   (logged-in users)
// Body: { orderId }  — the _id of an Order already created in Week 6
//
// We create a matching order on Razorpay's side and return the
// gateway order id + public key so the browser can open Checkout.
// ───────────────────────────────────────────────────────────
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
 
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
 
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.isPaid) {
      return res.status(409).json({ message: 'Order is already paid' });
    }
 
    // Razorpay expects the amount in the smallest currency unit (paise).
    // 499.50 rupees -> 49950 paise. Always round to an integer.
    const amountInPaise = Math.round(order.totalAmount * 100);

      
 
    const rzpOrder = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `order_${order._id}`,
      notes:    { dbOrderId: order._id.toString() },
    });
 
    // Remember the gateway order id so /verify can match it later.
    order.paymentMethod = 'Razorpay';
    order.paymentResult = {
      razorpayOrderId: rzpOrder.id,
      status: 'created',
    };
    await order.save();
 
    res.json({
      keyId:           process.env.RAZORPAY_KEY_ID,  // public key, safe to send
      razorpayOrderId: rzpOrder.id,
      amount:          rzpOrder.amount,              // echo back in paise
      currency:        rzpOrder.currency,
      dbOrderId:       order._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not start payment' });
  }
};
 
// ───────────────────────────────────────────────────────────
// POST /api/payment/verify   (logged-in users)
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
//
// The browser sends back what Checkout returned. We MUST recompute
// the signature ourselves — never trust the client that it paid.
// ───────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
 
    // 1. Recompute the signature with our SECRET key.
    //    Formula (Razorpay docs): HMAC_SHA256(order_id + "|" + payment_id)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
 
    // 2. Constant-time compare. If they differ, the request is forged.
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
 
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
 
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
 
    // 3. Idempotency — the webhook may have already marked it paid.
    //    Returning the order as-is keeps the operation safe to repeat.
    if (order.isPaid) return res.json(order);
 
    order.isPaid        = true;
    order.paidAt        = new Date();
    order.status        = 'paid';
    order.paymentResult = {
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status:            'paid',
    };
    await order.save();
 
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Verification failed' });
  }
};
 
// ───────────────────────────────────────────────────────────
// POST /api/payment/webhook   (PUBLIC — called by Razorpay servers)
//
// This is the source of truth. Even if the browser closes before
// /verify runs, Razorpay still tells us the outcome here.
// IMPORTANT: this handler needs the RAW request body (see server.js).
// ───────────────────────────────────────────────────────────
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
 
    // req.body is a Buffer here because express.raw() was used.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');
 
    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }
 
    // Signature is valid — now it is safe to parse the JSON.
    const event = JSON.parse(req.body.toString());
 
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const order = await Order.findOne({
        'paymentResult.razorpayOrderId': payment.order_id,
      });
 
      if (order && !order.isPaid) {          // idempotent
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'paid';
        order.paymentResult.razorpayPaymentId = payment.id;
        order.paymentResult.status = 'paid';
        await order.save();
      }
    }
 
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const order = await Order.findOne({
        'paymentResult.razorpayOrderId': payment.order_id,
      });
      if (order && !order.isPaid) {
        order.paymentResult.status = 'failed';
        await order.save();
      }
    }
 
    // Always respond 200 fast, or Razorpay keeps retrying the webhook.
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

