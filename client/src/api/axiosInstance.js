import axios from 'axios'

// ─── Base Instance ────────────────────────────────────────────────────────────
// All API calls go through this instance.
// The request interceptor automatically attaches the JWT from localStorage,
// so you never need to manually set Authorization headers in your components.

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before every request — reads the token from localStorage and attaches it.

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401 globally — clears localStorage and redirects to /login.
// This avoids having to handle expired tokens in every component individually.

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirect to login if token expires mid-session
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance