
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrder   as createOrderAPI,
  fetchMyOrders,
  fetchOrderById,
  cancelOrder   as cancelOrderAPI,
} from './orderAPI';
 
// ── Thunks ────────────────────────────────
export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrderAPI(orderData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Could not place order'
      );
    }
  }
);
 
export const loadMyOrders = createAsyncThunk(
  'orders/loadMine',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchMyOrders(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load orders'
      );
    }
  }
);
 
export const loadOrderById = createAsyncThunk(
  'orders/loadOne',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchOrderById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Order not found'
      );
    }
  }
);
 
export const cancelMyOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await cancelOrderAPI(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Could not cancel order'
      );
    }
  }
);
 
// ── State ───────────────────────────────
const initialState = {
  list: [],
  page: 1,
  pages: 1,
  total: 0,
  current: null,      // single order detail
  lastOrder: null,    // set after successful placeOrder
  loading: false,
  error: null,
};
 
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // loadMyOrders
      .addCase(loadMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list  = action.payload.orders;
        state.page  = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(loadMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // loadOrderById
      .addCase(loadOrderById.pending, (state) => {
        state.loading = true;
        state.current = null;
        state.error = null;
      })
      .addCase(loadOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(loadOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // cancelMyOrder
      .addCase(cancelMyOrder.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.list.findIndex(
          (o) => o._id === action.payload._id
        );
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});
 
export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;

