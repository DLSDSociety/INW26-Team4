import api from '../../api/axiosConfig';

export const subscribe = async (email, source = 'other') => {
  const res = await api.post('/newsletter/subscribe', { email, source });
  return res.data; // { message }
};