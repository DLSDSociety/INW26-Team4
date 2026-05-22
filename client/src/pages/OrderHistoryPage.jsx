import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loadMyOrders } from '../features/orders/orderSlice';

import Loader from '../components/common/Loader';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const OrderHistoryPage = () => {
  const dispatch = useDispatch();

  const {
    list,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(
      loadMyOrders({
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        My Orders
      </h1>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700
                     rounded-lg px-4 py-3 mb-4 text-sm"
        >
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">
            No orders yet
          </p>

          <Link
            to="/products"
            className="text-blue-600 hover:underline text-sm"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-2xl border
                         border-gray-200 p-5 hover:shadow-md transition"
            >
              <div
                className="flex flex-wrap items-center
                           justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-gray-400">
                    Order ID
                  </p>

                  <p className="font-mono text-sm text-gray-700">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Placed on
                  </p>

                  <p className="text-sm text-gray-700">
                    {new Date(order.createdAt)
                      .toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Items
                  </p>

                  <p className="text-sm text-gray-700">
                    {order.items.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Total
                  </p>

                  <p className="font-bold text-blue-600">
                    ₹
                    {order.totalAmount
                      .toLocaleString('en-IN')}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1
                              rounded-full
                              ${STATUS_STYLES[order.status]}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;