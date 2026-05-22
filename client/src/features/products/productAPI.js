import api from '../../api/axiosConfig';
 
// GET /api/products with query params
export const fetchProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;       // { products, page, pages, total }
};
 
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
 
export const fetchCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;       // array of strings
};

