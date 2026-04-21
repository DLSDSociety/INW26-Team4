import { createSlice } from '@reduxjs/toolkit'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => ({
      totalQuantity: totals.totalQuantity + item.quantity,
      totalPrice: totals.totalPrice + item.price * item.quantity,
    }),
    { totalQuantity: 0, totalPrice: 0 }
  )
}

// ─── Initial State ────────────────────────────────────────────────────────────

const persistedItems = loadCartFromStorage()
const { totalQuantity, totalPrice } = calculateTotals(persistedItems)

const initialState = {
  items: persistedItems,       // [{ _id, name, price, image, quantity, stock }]
  totalQuantity,
  totalPrice,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const incoming = action.payload // { _id, name, price, image, stock }
      const existing = state.items.find((i) => i._id === incoming._id)

      if (existing) {
        // Don't exceed available stock
        if (existing.quantity < existing.stock) {
          existing.quantity += 1
        }
      } else {
        state.items.push({ ...incoming, quantity: 1 })
      }

      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
      saveCartToStorage(state.items)
    },

    removeItem(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload)
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
      saveCartToStorage(state.items)
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i._id === id)
      if (item) {
        item.quantity = Math.min(Math.max(1, quantity), item.stock)
      }
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
      saveCartToStorage(state.items)
    },

    clearCart(state) {
      state.items = []
      state.totalQuantity = 0
      state.totalPrice = 0
      localStorage.removeItem('cart')
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity
export const selectCartTotalPrice = (state) => state.cart.totalPrice