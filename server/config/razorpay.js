const Razorpay = require('razorpay');
 
// One shared, configured Razorpay client for the whole app.
// key_id is safe to expose to the browser; key_secret is NOT.
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
 
module.exports = razorpay;

