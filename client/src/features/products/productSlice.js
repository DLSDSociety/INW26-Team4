import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchCategories } from './productAPI';
 
// ── Async thunks ────────────────────────────────────────────────
export const loadProducts = createAsyncThunk(
  'products/loadAll',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProducts(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products');
    }
  }
);
 
export const loadProductById = createAsyncThunk(
  'products/loadOne',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);
 
export const loadCategories = createAsyncThunk(
  'products/loadCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategories();
    } catch  {
      return rejectWithValue('Failed to load categories');
    }
  }
);
 
// ── Initial state ───────────────────────────────────────────────
const initialState = {
  list: [],
  categories: [],
  page: 1,
  pages: 1,
  total: 0,
  current: null,        // single product detail
  loading: false,
  error: null,
};
 
// ── Slice ───────────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadProducts
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list  = action.payload.products;
        state.page  = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // loadProductById
      .addCase(loadProductById.pending, (state) => {
        state.loading = true;
        state.current = null;
        state.error = null;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // loadCategories
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});
 
export const { clearCurrent, clearError } = productSlice.actions;
export default productSlice.reducer;

