import { useEffect, useMemo, useState } from 'react';
import { getAdminUsers } from '../../features/admin/adminAPI';
import TableSkeleton from '../../components/ui/TableSkeleton';
 
const AdminUsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [q, setQ]             = useState('');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    (async () => {
      try {
        setUsers(await getAdminUsers());
      } catch {
        /* interceptor toasted */
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  // Client-side search — small user list, no extra request.
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t)
    );
  }, [q, users]);
 
  if (loading) return <TableSkeleton rows={8} cols={3} />;
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Users
        </h1>
        <div>
          <label htmlFor="userSearch" className="sr-only">
            Search users
          </label>
          <input
            id="userSearch"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="border border-gray-300 rounded-lg
              px-3 py-2 text-sm w-64"
          />
        </div>
      </div>
 
      <div className="bg-white rounded-2xl border
                      border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u._id}>
                <td className="px-5 py-3">{u.name}</td>
                <td className="px-5 py-3 text-gray-600">
                  {u.email}
                </td>
                <td className="px-5 py-3">{u.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No users match "{q}".
          </p>
        )}
      </div>
    </div>
  );
};
 
export default AdminUsersPage;

