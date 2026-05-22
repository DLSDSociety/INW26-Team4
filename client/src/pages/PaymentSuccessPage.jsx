import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrderById } from '../features/orders/orderSlice';
import Loader from '../components/common/Loader';
 
const PaymentSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((s) => s.orders);
 
  // Re-fetch from the server so we display the verified, paid order
  useEffect(() => {
    dispatch(loadOrderById(id));
  }, [dispatch, id]);
 
  if (loading || !order) return <Loader />;
 
  return (
    <div className='max-w-xl mx-auto text-center py-16'>
      <div className='w-20 h-20 mx-auto rounded-full bg-green-100
                      flex items-center justify-center mb-6'>
        <span className='text-green-600 text-4xl'>✓</span>
      </div>
 
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>
        Payment Successful
      </h1>
      <p className='text-gray-500 mb-8'>
        Thank you — your order is confirmed and paid.
      </p>
 
      <div className='bg-white border border-gray-200 rounded-2xl
                      p-6 text-left space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Order ID</span>
          <span className='font-mono text-gray-800'>{order._id}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Payment ID</span>
          <span className='font-mono text-gray-800'>
            {order.paymentResult?.razorpayPaymentId}
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Amount Paid</span>
          <span className='font-bold text-blue-600'>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Status</span>
          <span className='font-semibold text-green-600'>
            {order.status.toUpperCase()}
          </span>
        </div>
      </div>
 
      <div className='flex gap-4 justify-center mt-8'>
        <Link
          to={`/orders/${order._id}`}
          className='bg-blue-600 text-white px-6 py-2.5 rounded-lg
                     font-semibold hover:bg-blue-700 transition'
        >
          View Order
        </Link>
        <Link
          to='/products'
          className='border border-gray-300 text-gray-700 px-6 py-2.5
                     rounded-lg font-semibold hover:bg-gray-50 transition'
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
 
export default PaymentSuccessPage;

