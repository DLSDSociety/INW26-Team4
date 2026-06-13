import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
 
// ── Request: attach JWT (unchanged from Week 4) ──
api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 
// ── Response: one place for every failure ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const msg = error.response?.data?.message || 'Something went wrong';

    // A 401 from login/register means "bad credentials",
    // NOT an expired session — show the real server message.
    const isAuthAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthAttempt) {
      store.dispatch(logout());
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);

export default api;

