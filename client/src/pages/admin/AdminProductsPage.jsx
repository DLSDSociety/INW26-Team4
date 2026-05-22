import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getAdminProducts, deleteProduct,
} from '../../features/admin/adminAPI';
import TableSkeleton from '../../components/ui/TableSkeleton';
 
const AdminProductsPage = () => {
  const [data, setData]       = useState({ products: [], pages: 1 });
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
 
  const load = async (p) => {
    setLoading(true);
    try {
      setData(await getAdminProducts(p));
    } catch {
      /* interceptor toasted */
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { load(page); }, [page]);
 
  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`))
      return;
    try {
      await deleteProduct(id);
      setData((d) => ({
        ...d,
        products: d.products.filter((p) => p._id !== id),
      }));
      toast.success('Product deleted');
    } catch {
      /* interceptor toasted */
    }
  };
 
  if (loading) return <TableSkeleton rows={8} cols={4} />;
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-900">Products</h1>
  <Link
    to="/admin/products/new"
    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
  >
    + Add Product
  </Link>
</div>
 
      <div className="bg-white rounded-2xl border
                      border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.products.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3">{p.name}</td>
                <td className="px-5 py-3">
                  ₹{Number(p.price).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3">{p.stock}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(p._id, p.name)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Pagination */}
      <div className="flex items-center justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1.5 rounded-lg border text-sm
            disabled:opacity-40"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {data.pages}
        </span>
        <button
          disabled={page >= data.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1.5 rounded-lg border text-sm
            disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
 
export default AdminProductsPage;

