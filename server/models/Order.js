const mongoose = require('mongoose');
 
// Each line item is a SNAPSHOT taken at purchase time.
// We copy name/price/image so the receipt never changes
// even if the product is edited or deleted later.
const orderItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    image:    { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);




 
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSchema],
 
    shippingAddress: {
      fullName:   { type: String, required: true },
      address:    { type: String, required: true },
      city:       { type: String, required: true },
      postalCode: { type: String, required: true },
      phone:      { type: String, required: true },
    },
 
    itemsPrice:    { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount:   { type: Number, required: true, default: 0 },
 
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
 
    // Week 7 will switch this to an online gateway
    // 'COD' = cash on delivery (Week 6 behaviour, no online payment)
    // 'Razorpay' = online payment via the gateway
    paymentMethod: {
      type: String,
      enum: ['COD', 'Razorpay'],
      default: 'COD',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
 
    // Everything the gateway gives us, kept for audit + verification.
    // status: 'created' -> Razorpay order made, awaiting payment
    //         'paid'    -> signature verified, money captured
    //         'failed'  -> gateway reported the payment failed
    paymentResult: {
      razorpayOrderId:   { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      status:            { type: String },
    },
  },
  { timestamps: true }
);

 
module.exports = mongoose.model('Order', orderSchema);
