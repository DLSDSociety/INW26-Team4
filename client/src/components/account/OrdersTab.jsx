import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadMyOrders } from '../../features/orders/orderSlice';

const STATUS_BADGE = {
  pending:    'bg-yellow-50 text-yellow-700',
  paid:       'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped:    'bg-purple-50 text-purple-700',
  delivered:  'bg-green-50 text-green-700',
  cancelled:  'bg-red-50 text-red-700',
};

const OrdersTab = () => {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(loadMyOrders()); }, [dispatch]);

  const recent = list.slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">Your five most recent orders.</p>
        </div>
        <Link to="/orders"
              className="text-sm text-blue-600 hover:underline font-medium">
          View all →
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}

      {!loading && recent.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">No orders yet.</p>
          <Link to="/products" className="text-blue-600 hover:underline text-sm">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {recent.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`}
                className="block border border-gray-200 rounded-xl p-4
                           hover:shadow-sm transition">
            <div className="flex flex-wrap justify-between gap-3 items-center">
              <div>
                <p className="text-xs text-gray-400">Order</p>
                <p className="font-mono text-xs text-gray-700">
                  #{o._id.slice(-8)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="text-sm">
                  {new Date(o.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Items</p>
                <p className="text-sm">{o.items.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="font-bold text-blue-600">
                  ₹{o.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full
                                ${STATUS_BADGE[o.status]}`}>
                {o.status.toUpperCase()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;

