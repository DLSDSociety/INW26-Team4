import api from '../../api/axiosConfig';

export const updateProfile = (data) =>
  api.put('/users/profile', data).then((r) => r.data);

export const changePassword = (data) =>
  api.put('/users/password', data).then((r) => r.data);

export const listAddresses = () =>
  api.get('/users/addresses').then((r) => r.data);

export const addAddress = (data) =>
  api.post('/users/addresses', data).then((r) => r.data);

export const updateAddress = (id, data) =>
  api.put(`/users/addresses/${id}`, data).then((r) => r.data);

export const deleteAddress = (id) =>
  api.delete(`/users/addresses/${id}`).then((r) => r.data);

export const deleteAccount = (currentPassword) =>
  api.delete('/users/account', { data: { currentPassword } }).then((r) => r.data);
