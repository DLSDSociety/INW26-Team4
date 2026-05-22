import api from '../../api/axiosConfig';
 
// All endpoints below were built & tested in Week 8.
// The JWT + admin role is enforced server-side by
// adminMiddleware; the token is attached by the interceptor.
 
// frontend/src/features/admin/adminAPI.js

export const getAdminOrders = async (status = '') => {
  const res = await api.get('/admin/orders', {
    params: status ? { status } : {},
  });
  // Handle both shapes: bare array OR { success, orders: [...] }
  return Array.isArray(res.data) ? res.data : (res.data.orders ?? []);
};

export const getAdminProducts = async (page = 1) => {
  const res = await api.get('/products', { params: { page, limit: 10 } });
  // expected: { products, page, pages, total }  — pass through if so
  if (res.data?.products) return res.data;
  return { products: Array.isArray(res.data) ? res.data : [], page: 1, pages: 1 };
};

export const getAdminUsers = async () => {
  const res = await api.get('/admin/users');
  return Array.isArray(res.data) ? res.data : (res.data.users ?? []);
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  // Accept either { revenue, ordersCount, usersCount, topProducts } 
  // or { success, stats: {...} }
  return res.data?.stats ?? res.data;
};

export const getSalesChart = async () => {
  const res = await api.get('/admin/sales-chart');
  return Array.isArray(res.data) ? res.data : (res.data.data ?? res.data.sales ?? []);
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.patch(`/admin/orders/${id}`, { status });
  return res.data?.order ?? res.data;
};
export const getTopProducts = async () => {
  const res = await api.get('/admin/stats');
  // stats can be { topProducts: [...] }  or  { success, stats: { topProducts: [...] } }
  const stats = res.data?.stats ?? res.data;
  return stats?.topProducts ?? [];
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
  return id;
};