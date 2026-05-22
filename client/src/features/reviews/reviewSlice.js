// ============================================================
// REVIEW SLICE
// Redux Toolkit
// ============================================================

import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import {
  fetchProductReviews,
  submitReview,
} from './reviewAPI';



// ============================================================
// LOAD REVIEWS
// Fetch paginated reviews for a product
// ============================================================

export const loadReviews = createAsyncThunk(
  'reviews/load',

  async (
    { productId, page = 1 },
    { rejectWithValue }
  ) => {

    try {

      return await fetchProductReviews(
        productId,
        page
      );

    } catch (err) {

      return rejectWithValue(
        err.response?.data?.message ||
        'Failed to load reviews'
      );
    }
  }
);



// ============================================================
// POST REVIEW
// Submit a new product review
// ============================================================

export const postReview = createAsyncThunk(
  'reviews/post',

  async (
    payload,
    { rejectWithValue }
  ) => {

    try {

      return await submitReview(payload);

    } catch (err) {

      return rejectWithValue(
        err.response?.data?.message ||
        'Failed to submit review'
      );
    }
  }
);



// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {

  // Reviews list
  list: [],

  // Pagination
  page: 1,
  pages: 1,
  total: 0,

  // Loading states
  loading: false,
  error: null,

  // Submission states
  submitting: false,
  submitError: null,
};



// ============================================================
// SLICE
// ============================================================

const reviewSlice = createSlice({
  name: 'reviews',

  initialState,

  reducers: {

    // --------------------------------------------------------
    // Clear review state
    // --------------------------------------------------------

    clearReviews: (state) => {

      state.list = [];

      state.page = 1;
      state.pages = 1;
      state.total = 0;

      state.error = null;
      state.submitError = null;
    },
  },



  // ==========================================================
  // EXTRA REDUCERS
  // ==========================================================

  extraReducers: (builder) => {

    builder


      // ======================================================
      // LOAD REVIEWS
      // ======================================================

      .addCase(loadReviews.pending, (state) => {

        state.loading = true;
        state.error = null;
      })

      .addCase(loadReviews.fulfilled, (state, action) => {

        state.loading = false;

        state.list = action.payload.reviews;

        state.page = action.payload.page;

        state.pages = action.payload.pages;

        state.total = action.payload.total;
      })

      .addCase(loadReviews.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;
      })



      // ======================================================
      // POST REVIEW
      // ======================================================

      .addCase(postReview.pending, (state) => {

        state.submitting = true;

        state.submitError = null;
      })

      .addCase(postReview.fulfilled, (state) => {

        state.submitting = false;
      })

      .addCase(postReview.rejected, (state, action) => {

        state.submitting = false;

        state.submitError = action.payload;
      });
  },
});



// ============================================================
// EXPORT ACTIONS
// ============================================================

export const {
  clearReviews,
} = reviewSlice.actions;



// ============================================================
// EXPORT REDUCER
// ============================================================

export default reviewSlice.reducer;