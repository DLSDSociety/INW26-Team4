const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');

// ───────────────────────────────────────
// POST /api/orders
// Create order (logged-in users)
// ───────────────────────────────────────
// ───────────────────────────────────────
// POST /api/orders
// Create order (logged-in users)
// ───────────────────────────────────────
exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: 'Cart is empty',
    });
  }

  if (!shippingAddress || !shippingAddress.address) {
    return res.status(400).json({
      message: 'Shipping address is required',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let itemsPrice = 0;

    const orderItems = [];

    // Validate every order item against live DB data
    for (const item of items) {
      if (item.quantity < 1) {
        throw {
          status: 422,
          message: 'Invalid quantity',
        };
      }

      // Atomic: decrement stock ONLY if enough is available.
      // We do NOT use product.save() because that re-validates the
      // ENTIRE product document (and your products have no
      // `description`, which the schema marks as required).
      // $inc with a {stock: $gte} filter also makes the
      // check + decrement race-safe under concurrent orders.
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true, session }
      );

      // null means: product missing OR not enough stock
      if (!product) {
        const exists = await Product.findById(item.product)
          .session(session);

        if (!exists) {
          throw {
            status: 404,
            message: `Product not found: ${item.product}`,
          };
        }

        throw {
          status: 409,
          message:
            `Insufficient stock for ${exists.name}. ` +
            `Only ${exists.stock} left.`,
        };
      }

      // Server computes prices — never trust client pricing
      itemsPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: item.quantity,
      });
    }

    const shippingPrice = itemsPrice > 1000 ? 0 : 50;

    const totalAmount = itemsPrice + shippingPrice;

    // Order.create([...]) returns array
    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          itemsPrice,
          shippingPrice,
          totalAmount,
          status: 'pending',
          paymentMethod: paymentMethod === 'Razorpay' ? 'Razorpay' : 'COD',
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();

    const status = err.status || 500;

    res.status(status).json({
      message: err.message || 'Order creation failed',
    });
  } finally {
    session.endSession();
  }
};
// ───────────────────────────────────────
// GET /api/orders/my-orders
// Paginated current user orders
// ───────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      20,
      Math.max(1, Number(req.query.limit) || 10)
    );

    const skip = (page - 1) * limit;

    const filter = {
      user: req.user._id,
    };

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),

      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ───────────────────────────────────────
// GET /api/orders/:id
// Owner or admin only
// ───────────────────────────────────────
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    const isOwner =
      order.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to view this order',
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ───────────────────────────────────────
// PATCH /api/orders/:id/cancel
// Cancel order + restore stock
// Owner or admin only
// ───────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id)
      .session(session);

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found',
      };
    }

    const isOwner =
      order.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      throw {
        status: 403,
        message: 'Not authorized',
      };
    }

    if (
      ['shipped', 'delivered', 'cancelled']
        .includes(order.status)
    ) {
      throw {
        status: 400,
        message:
          `Cannot cancel an order that is ${order.status}`,
      };
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        { session }
      );
    }

    order.status = 'cancelled';

    await order.save({ session });

    await session.commitTransaction();

    res.json(order);
  } catch (err) {
    await session.abortTransaction();

    const status = err.status || 500;

    res.status(status).json({
      message: err.message || 'Cancellation failed',
    });
  } finally {
    session.endSession();
  }
};