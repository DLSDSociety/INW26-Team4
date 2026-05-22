import api from '../../api/axiosConfig';
 
// Ask our backend to create a Razorpay order for an existing DB order.
// Returns { keyId, razorpayOrderId, amount, currency, dbOrderId }
export const createPaymentOrder = async (orderId) => {
  const res = await api.post('/payment/create-order', { orderId });
  return res.data;
};
 
// Send the Checkout response back for server-side signature verification.
// Returns the updated, now-paid order document.
export const verifyPayment = async (payload) => {
  const res = await api.post('/payment/verify', payload);
  return res.data;
};

