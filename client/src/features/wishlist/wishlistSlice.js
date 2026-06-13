import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWishlistAPI,
  addToWishlistAPI,
  removeFromWishlistAPI,
  clearWishlistAPI,
} from './wishlistAPI';
 
// ── thunks ──────────────────────────────────────────────────────
 
export const loadWishlist = createAsyncThunk(
  'wishlist/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchWishlistAPI();           // { items, count }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load wishlist');
    }
  },
);
 
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue }) => {
    try {
      await addToWishlistAPI(productId);
      return productId;
    } catch (err) {
      return rejectWithValue({
        productId,
        message: err.response?.data?.message || 'Failed to add to wishlist',
      });
    }
  },
);
 
export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, { rejectWithValue }) => {
    try {
      await removeFromWishlistAPI(productId);
      return productId;
    } catch (err) {
      return rejectWithValue({
        productId,
        message: err.response?.data?.message || 'Failed to remove from wishlist',
      });
    }
  },
);
 
export const clearWishlist = createAsyncThunk(
  'wishlist/clear',
  async (_, { rejectWithValue }) => {
    try {
      await clearWishlistAPI();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear wishlist');
    }
  },
);
 
// ── slice ──────────────────────────────────────────────────────
 
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items:   [],   // full populated product objects (for /wishlist page)
    ids:     [],   // string ObjectIds (for fast heart-state lookup)
    loading: false,
    error:   null,
  },
  reducers: {
    // Cleared on logout from the auth slice; see Step 12.
    resetWishlist: (state) => {
      state.items = [];
      state.ids   = [];
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b
      // load
      .addCase(loadWishlist.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loadWishlist.fulfilled, (s, a) => {
        s.loading = false;
        s.items   = a.payload.items;
        s.ids     = a.payload.items.map((p) => p._id);
      })
      .addCase(loadWishlist.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
 
      // add — optimistic
      .addCase(addToWishlist.pending, (s, a) => {
        const id = a.meta.arg;
        if (!s.ids.includes(id)) s.ids.push(id);     // flip heart immediately
      })
      .addCase(addToWishlist.rejected, (s, a) => {
        // roll back the optimistic flip
        s.ids  = s.ids.filter((id) => id !== a.payload.productId);
        s.error = a.payload.message;
      })
 
      // remove — optimistic
      .addCase(removeFromWishlist.pending, (s, a) => {
        const id = a.meta.arg;
        s.ids   = s.ids.filter((x) => x !== id);
        s.items = s.items.filter((p) => p._id !== id);
      })
      .addCase(removeFromWishlist.rejected, (s, a) => {
        // roll back: re-add the id (item details will be re-fetched on next page load)
        if (!s.ids.includes(a.payload.productId)) s.ids.push(a.payload.productId);
        s.error = a.payload.message;
      })
 
      // clear
      .addCase(clearWishlist.fulfilled, (s) => { s.items = []; s.ids = []; });
  },
});
 
export const { resetWishlist } = wishlistSlice.actions;
 
// ── selectors ──────────────────────────────────────────────────
 
export const selectWishlistItems = (s) => s.wishlist.items;
export const selectWishlistCount = (s) => s.wishlist.ids.length;
export const selectIsWishlisted  = (productId) => (s) => s.wishlist.ids.includes(productId);
 
export default wishlistSlice.reducer;

