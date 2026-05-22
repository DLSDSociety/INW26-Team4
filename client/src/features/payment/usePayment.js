import { useState } from 'react';
import { useSelector } from 'react-redux';
import { loadRazorpayScript } from '../../utils/loadRazorpay';
import { createPaymentOrder, verifyPayment } from './paymentAPI';
 
/**
 * usePayment() -> { pay, paying, error }
 *
 * pay(orderId, { onSuccess, onDismiss }) opens Razorpay Checkout for an
 * order that already exists in the database, then verifies the payment
 * on our server before calling onSuccess(updatedOrder).
 *
 * Reused by both CheckoutPage (pay right after placing) and
 * OrderDetailPage (Pay Now / retry an unpaid order).
 */
const usePayment = () => {
  const { user } = useSelector((s) => s.auth);
  const [paying, setPaying] = useState(false);
  const [error,  setError]  = useState(null);
 
  const pay = async (orderId, { onSuccess, onDismiss } = {}) => {
    setError(null);
    setPaying(true);
 
    try {
      const sdkOk = await loadRazorpayScript();
      if (!sdkOk) {
        setPaying(false);
        return setError('Payment SDK failed to load. Check your connection.');
      }
 
      // 1. Backend creates the Razorpay order and returns the public key.
      const { keyId, razorpayOrderId, amount, currency } =
        await createPaymentOrder(orderId);


 
      // 2. Configure and open the Checkout modal.
      const rzp = new window.Razorpay({
        key:         keyId,
        amount,                          // paise, straight from the server
        currency,
        name:        'ShopMERN',
        description: `Payment for order ${orderId}`,
        order_id:    razorpayOrderId,
        prefill: {
          name:  user?.name  || '',
          email: user?.email || '',
        },
        theme: { color: '#2563EB' },
 
        // 3. Runs after the user pays — verify on our server.
        handler: async (response) => {
          try {
            const updatedOrder = await verifyPayment({
              orderId,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            setPaying(false);
            onSuccess?.(updatedOrder);
          } catch (err) {
            setPaying(false);
            setError(err.response?.data?.message || 'Verification failed');
          }
        },
 
        modal: {
          ondismiss: () => {            // user closed the popup
            setPaying(false);
            onDismiss?.();
          },
        },
      });
 
      rzp.on('payment.failed', (resp) => {
        setPaying(false);
        setError(resp.error?.description || 'Payment failed. Please try again.');
      });
 
      rzp.open();
    } catch (err) {
      setPaying(false);
      setError(err.response?.data?.message || 'Could not start payment');
    }
  };
 
  return { pay, paying, error };
};
 
export default usePayment;

