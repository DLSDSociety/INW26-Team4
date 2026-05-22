import api from '../../api/axiosConfig';   // the shared axios instance from Week 4
 
export const fetchWishlistAPI = () =>
  api.get('/wishlist').then((r) => r.data);          // { items, count }
 
export const addToWishlistAPI = (productId) =>
  api.post(`/wishlist/${productId}`).then((r) => r.data);
 
export const removeFromWishlistAPI = (productId) =>
  api.delete(`/wishlist/${productId}`).then((r) => r.data);
 
export const clearWishlistAPI = () =>
  api.delete('/wishlist').then((r) => r.data);

