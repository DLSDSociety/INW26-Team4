const Product = require('../models/Product');
 
// ───────────────────────────────────────────────────────────
// GET /api/products
// Query params: search, category, minPrice, maxPrice, sort, page, limit
// ───────────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const {
      search   = '',
      category = '',
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      sort     = 'newest',
      page     = 1,
      limit    = 12,
    } = req.query;
 
    // ── Build filter object ─────────────────────────────────
    const filter = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };
 
    if (search) {
      // case-insensitive partial match on name OR description
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }
 
    if (category && category !== 'all') {
      filter.category = category;
    }
 
    // ── Build sort object ──────────────────────────────────
    const sortMap = {
      newest:    { createdAt: -1 },
      oldest:    { createdAt:  1 },
      priceAsc:  { price:      1 },
      priceDesc: { price:     -1 },
      ratingDesc:{ rating:    -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;
 
    // ── Pagination math ────────────────────────────────────
    const pageNum  = Math.max(1, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * pageSize;
 
    // ── Execute count + query in parallel ──────────────────
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortBy).skip(skip).limit(pageSize),
    ]);
 
    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ───────────────────────────────────────────────────────────
// GET /api/products/categories
// Returns distinct list of categories — used for filter dropdown
// ───────────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ───────────────────────────────────────────────────────────
// GET /api/products/:id
// ───────────────────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ───────────────────────────────────────────────────────────
// POST /api/products      (admin only)
// Multipart form with 'images' field (up to 5 files)
// ───────────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand } = req.body;
 
    // multer-storage-cloudinary puts the URL on file.path
    const imageUrls = (req.files || []).map((f) => f.path);
 
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      brand,
      images: imageUrls,
      createdBy: req.user._id,
    });
 
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
 
// ───────────────────────────────────────────────────────────
// PUT /api/products/:id   (admin only)
// ───────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
 
    // Update text fields if present
    ['name', 'description', 'price', 'stock', 'category', 'brand'].forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });
 
    // If new images uploaded, append to existing array
    if (req.files && req.files.length > 0) {
      product.images = [...product.images, ...req.files.map((f) => f.path)];
    }
 
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
 
// ───────────────────────────────────────────────────────────
// DELETE /api/products/:id (admin only)
// ───────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
 
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

