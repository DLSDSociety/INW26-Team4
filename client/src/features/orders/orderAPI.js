import api from '../../api/axiosConfig';

export const createOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);

  return res.data;
};

export const fetchMyOrders = async (params) => {
  const res = await api.get('/orders/my-orders', {
    params,
  });

  return res.data; // { orders, page, pages, total }
};

export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);

  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await api.patch(`/orders/${id}/cancel`);

  return res.data;
};