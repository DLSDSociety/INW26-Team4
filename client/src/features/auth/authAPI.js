import api from '../../api/axiosConfig';

/**
 * Auth API — Step 6.
 *
 * Thin wrappers over the Week 3 backend endpoints. Each returns
 * response.data, which has the shape:
 *   { success, token, user: { _id, name, email, role } }
 * (and { user } for getProfile).
 */

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login an existing user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Get the logged-in user's profile (requires a valid token)
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
