import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import {
  loginUser,
  registerUser,
  getProfile,
} from './authAPI';

import {
  resetWishlist,
} from '../wishlist/wishlistSlice';

import * as userAPI from '../user/userAPI';

/**
 * AUTH SLICE
 *
 * Handles:
 * - login
 * - registration
 * - persistent sessions
 * - profile updates
 * - password changes
 * - logout cleanup
 */

// ─────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ─────────────────────────────────────────────────────────────

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);

      localStorage.setItem(
        'token',
        data.token
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        'Login failed'
      );
    }
  }
);

// REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);

      localStorage.setItem(
        'token',
        data.token
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        'Registration failed'
      );
    }
  }
);

// RESTORE SESSION
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfile();

      return data;
    } catch {
      localStorage.removeItem('token');

      return rejectWithValue(
        'Session expired'
      );
    }
  }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.updateProfile(data);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message ||
        'Update failed'
      );
    }
  }
);

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.changePassword(data);
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message ||
        'Password change failed'
      );
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');

    // CLEAR WISHLIST
    dispatch(resetWishlist());

    return true;
  }
);

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ───────────────── LOGIN ─────────────────

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── REGISTER ─────────────────

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── LOAD USER ─────────────────

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(loadUser.rejected, (state) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ───────────────── UPDATE PROFILE ─────────────────

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── CHANGE PASSWORD ─────────────────

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── LOGOUT ─────────────────

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const {
  clearError,
} = authSlice.actions;

export default authSlice.reducer;