import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAdminOrders, updateOrderStatus,
} from '../../features/admin/adminAPI';
import TableSkeleton from '../../components/ui/TableSkeleton';
 
const STATUSES = ['pending', 'paid', 'processing',
  'shipped', 'delivered', 'cancelled'];
 
const badge = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};
 
const AdminOrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);
 
  const load = async (status) => {
    setLoading(true);
    try {
      setOrders(await getAdminOrders(status));
    } catch {
      /* interceptor toasted */
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { load(filter); }, [filter]);
 
  const onChangeStatus = async (id, status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated : o)));
      toast.success('Order status updated');
    } catch {
      /* interceptor toasted */
    }
  };
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Orders
        </h1>
        <div>
          <label htmlFor="statusFilter" className="sr-only">
            Filter by status
          </label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg
                       px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
 
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : orders.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">
          No orders found.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border
                        border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left
                              text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-5 py-3 font-mono text-xs">
                    {o._id.slice(-8)}
                  </td>
                  <td className="px-5 py-3">
                    {o.user?.name || '—'}
                  </td>
                  <td className="px-5 py-3">
                    ₹{Number(o.totalAmount)
                      .toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full
                      text-xs font-medium ${badge[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      aria-label={`Update status for order
                        ${o._id.slice(-8)}`}
                      value={o.status}
                      onChange={(e) =>
                        onChangeStatus(o._id, e.target.value)}
                      className="border border-gray-300
                        rounded-lg px-2 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default AdminOrdersPage;

