
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer    from '../features/cart/cartSlice';
import orderReducer   from '../features/orders/orderSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import userReducer from '../features/user/userSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';


 
export const store = configureStore({
  reducer: {
    auth:     authReducer,
    products: productReducer,
    cart:     cartReducer,
    orders:   orderReducer,
    reviews: reviewReducer,
    user:     userReducer,
    wishlist: wishlistReducer,
  },
});
 
export default store;

