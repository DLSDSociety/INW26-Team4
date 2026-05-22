import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  getStats, getSalesChart, getTopProducts,
} from '../../features/admin/adminAPI';
import StatCard from '../../components/ui/StatCard';
import Skeleton from '../../components/ui/Skeleton';
 
const inr = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN');
 
const AdminDashboardPage = () => {
  const [stats, setStats]   = useState(null);
  const [sales, setSales]   = useState([]);
  const [top, setTop]       = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    (async () => {
      try {
        // Fire all three in parallel — they're independent.
        const [s, chart, products] = await Promise.all([
          getStats(),
          getSalesChart(),
          getTopProducts(),
        ]);
        setStats(s);
        setSales(chart);
        setTop(products);
      } catch {
        // interceptor already toasted the error
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard
      </h1>
 
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Revenue"
          value={inr(stats?.revenue)}      loading={loading} />
        <StatCard label="Total Orders"
          value={stats?.ordersCount ?? 0}  loading={loading} />
        <StatCard label="Total Users"
          value={stats?.usersCount ?? 0}   loading={loading} />
      </div>
 
      {/* Revenue line chart */}
      <section className="bg-white rounded-2xl border
                          border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">
          Revenue — last 30 days
        </h2>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3"
                stroke="#eee" />
              <XAxis dataKey="date" fontSize={12}
                tickLine={false} />
              <YAxis fontSize={12} tickLine={false}
                axisLine={false} />
              <Tooltip
                formatter={(v) => inr(v)} />
              <Line type="monotone" dataKey="revenue"
                stroke="#2563eb" strokeWidth={2}
                dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
 
      {/* Top products bar chart */}
      <section className="bg-white rounded-2xl border
                          border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">
          Top 5 selling products
        </h2>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top}>
              <CartesianGrid strokeDasharray="3 3"
                stroke="#eee" />
              <XAxis dataKey="name" fontSize={12}
                tickLine={false} />
              <YAxis fontSize={12} tickLine={false}
                axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sold" fill="#2563eb"
                radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
};
 
export default AdminDashboardPage;

