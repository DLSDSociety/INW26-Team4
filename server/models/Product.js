const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, min: 0, default: 10 },
    category:    { type: String, required: true, index: true },
    brand:       { type: String, default: '' },
 
    // Cloudinary URLs
    images:      [{ type: String }],
 
    // Aggregated review data (filled in Week 8)
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    numReviews:    { type: Number, default: 0 },
 
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
 
// Enable text search on name + description
// Filter by category (Week 5) + a text index for search
productSchema.index({ name: 'text', description: 'text' });

productSchema.index({ embedding: '2dsphere' });

 
module.exports = mongoose.model('Product', productSchema);

