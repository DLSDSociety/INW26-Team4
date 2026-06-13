const Order = require('../models/Order');
const User = require('../models/User');


// ============================================================
// GET ADMIN DASHBOARD STATS
// GET /api/admin/stats
// Private/Admin
//
// Returns:
// - total revenue
// - paid order count
// - pending order count
// - total users
// - top 5 selling products
// ============================================================

exports.getStats = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Revenue + paid orders
    // Only from paid orders
    // --------------------------------------------------------

    const [totals] = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: '$totalAmount',
          },

          paidOrders: {
            $sum: 1,
          },
        },
      },
    ]);



    // --------------------------------------------------------
    // Parallel counts
    // --------------------------------------------------------

    const [pendingOrders, totalUsers] = await Promise.all([

      Order.countDocuments({
        isPaid: false,
        status: { $ne: 'cancelled' },
      }),

      User.countDocuments(),

    ]);



    // --------------------------------------------------------
    // Top 5 best-selling products
    // --------------------------------------------------------

    const topProducts = await Order.aggregate([

      {
        $match: {
          isPaid: true,
        },
      },

      // Split items array into separate documents
      {
        $unwind: '$items',
      },

      // Group by product
      {
        $group: {
          _id: '$items.product',

          name: {
            $first: '$items.name',
          },

          unitsSold: {
            $sum: '$items.quantity',
          },

          revenue: {
            $sum: {
              $multiply: [
                '$items.price',
                '$items.quantity',
              ],
            },
          },
        },
      },

      // Highest selling first
      {
        $sort: {
          unitsSold: -1,
        },
      },

      // Top 5 only
      {
        $limit: 5,
      },
    ]);



    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      totalRevenue: totals?.totalRevenue || 0,
      paidOrders: totals?.paidOrders || 0,
      pendingOrders,
      totalUsers,
      topProducts,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



// ============================================================
// GET SALES CHART DATA
// GET /api/admin/sales-chart?days=30
// Private/Admin
//
// Returns daily revenue data
// ============================================================

exports.getSalesChart = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Days range validation
    // --------------------------------------------------------

    const days = Math.min(
      180,
      Math.max(1, Number(req.query.days) || 30)
    );

    const since = new Date();

    since.setDate(since.getDate() - days);



    // --------------------------------------------------------
    // Aggregate chart data
    // --------------------------------------------------------

    const data = await Order.aggregate([

      {
        $match: {
          isPaid: true,
          paidAt: {
            $gte: since,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$paidAt',
            },
          },

          revenue: {
            $sum: '$totalAmount',
          },

          orders: {
            $sum: 1,
          },
        },
      },

      // Oldest -> newest
      {
        $sort: {
          _id: 1,
        },
      },

      // Rename _id -> date
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          orders: 1,
        },
      },
    ]);



    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



// ============================================================
// GET ALL ORDERS
// GET /api/admin/orders
// Private/Admin
//
// Query Params:
// ?status=processing
// ?page=1
// ?limit=20
// ============================================================

exports.getAllOrders = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Query params
    // --------------------------------------------------------

    const { status } = req.query;

    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 20)
    );

    const skip = (page - 1) * limit;



    // --------------------------------------------------------
    // Filter
    // --------------------------------------------------------

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }



    // --------------------------------------------------------
    // Fetch orders + count
    // --------------------------------------------------------

    const [total, orders] = await Promise.all([

      Order.countDocuments(filter),

      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

    ]);



    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

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



// ============================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id
// Private/Admin
//
// Body:
// {
//   status
// }
//
// Allowed statuses:
// - processing
// - shipped
// - delivered
// ============================================================

exports.updateOrderStatus = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Allowed statuses
    // --------------------------------------------------------

    const ALLOWED = [
      'processing',
      'shipped',
      'delivered',
    ];

    const { status } = req.body;



    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!ALLOWED.includes(status)) {
      return res.status(400).json({
        message:
          'status must be one of: processing, shipped, delivered',
      });
    }



    // --------------------------------------------------------
    // Find order
    // --------------------------------------------------------

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }



    // --------------------------------------------------------
    // Prevent updates on cancelled orders
    // --------------------------------------------------------

    if (order.status === 'cancelled') {
      return res.status(409).json({
        message: 'Cannot update a cancelled order',
      });
    }



    // --------------------------------------------------------
    // Update status
    // --------------------------------------------------------

    order.status = status;

    await order.save();



    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};



// ============================================================
// GET ALL USERS
// GET /api/admin/users
// Private/Admin
//
// Includes order count using MongoDB lookup
// ============================================================

exports.getAllUsers = async (req, res) => {
  try {

    // --------------------------------------------------------
    // Aggregate users with order counts
    // --------------------------------------------------------

    const users = await User.aggregate([

      // LEFT JOIN users -> orders
      {
        $lookup: {
          from: 'orders',

          localField: '_id',

          foreignField: 'user',

          as: 'orders',
        },
      },

      // Select fields
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,

          orderCount: {
            $size: '$orders',
          },
        },
      },

      // Newest users first
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);



    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};