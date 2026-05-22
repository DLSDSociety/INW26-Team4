import {
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

// LOAD CART FROM STORAGE
const loadCart = () => {
  try {
    const data = localStorage.getItem('cart');

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// SAVE CART
const saveCart = (items) => {
  localStorage.setItem(
    'cart',
    JSON.stringify(items)
  );
};

// ITEM SHAPE
// {
//   product,
//   name,
//   price,
//   image,
//   countInStock,
//   qty
// }

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    // ADD ITEM
    addItem(state, action) {
      const incoming = {
        ...action.payload,

        // SAFETY
        qty: Number(action.payload.qty) || 1,

        price:
          Number(action.payload.price) || 0,

        countInStock:
          Number(
            action.payload.countInStock
          ) || 0,
      };

      const existing = state.items.find(
        (i) =>
          i.product === incoming.product
      );

      // UPDATE EXISTING
      if (existing) {
        existing.qty = Math.min(
          existing.countInStock,
          existing.qty + incoming.qty
        );
      }

      // ADD NEW
      else {
        state.items.push(incoming);
      }

      saveCart(state.items);
    },

    // REMOVE ITEM
    removeItem(state, action) {
      state.items = state.items.filter(
        (i) =>
          i.product !== action.payload
      );

      saveCart(state.items);
    },

    // UPDATE QUANTITY
    updateQuantity(state, action) {
      const { product, qty } =
        action.payload;

      const item = state.items.find(
        (i) => i.product === product
      );

      if (item) {
        item.qty = Math.max(
          1,

          Math.min(
            item.countInStock,
            Number(qty)
          )
        );
      }

      saveCart(state.items);
    },

    // CLEAR CART
    clearCart(state) {
      state.items = [];

      saveCart(state.items);
    },
  },
});

// ACTIONS
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

// SELECTORS
export const selectCartItems = (state) =>
  state.cart.items;

// TOTAL ITEMS
export const selectCartCount =
  createSelector(
    [selectCartItems],

    (items) =>
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.qty) || 1),
        0
      )
  );

// SUBTOTAL
export const selectCartSubtotal =
  createSelector(
    [selectCartItems],

    (items) =>
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0) *
            (Number(item.qty) || 1),
        0
      )
  );

export default cartSlice.reducer;