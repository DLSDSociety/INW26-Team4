import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      // params: { search, category, minPrice, maxPrice, sort, page, limit }
      const { data } = await axiosInstance.get('/products', { params })
      return data // { products, total, page, pages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}`)
      return data // { product }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found')
    }
  }
)

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  products: [],
  selectedProduct: null,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
    clearProductError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // ── Fetch All ──
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ── Fetch By ID ──
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedProduct = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearSelectedProduct, clearProductError } = productSlice.actions
export default productSlice.reducer

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectProducts = (state) => state.product.products
export const selectSelectedProduct = (state) => state.product.selectedProduct
export const selectProductLoading = (state) => state.product.loading
export const selectProductError = (state) => state.product.error
export const selectProductPages = (state) => state.product.pages