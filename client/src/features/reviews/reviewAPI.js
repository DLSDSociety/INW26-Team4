// ============================================================
// REVIEW API SERVICE
// ============================================================

import api from '../../api/axiosConfig';



// ============================================================
// FETCH PRODUCT REVIEWS
// Public API
//
// GET /api/reviews/product/:id
//
// Supports pagination
// Default: page 1
// ============================================================

export const fetchProductReviews = async (
  productId,
  page = 1
) => {

  const res = await api.get(
    `/reviews/product/${productId}?page=${page}&limit=5`
  );

  return res.data;
};



// ============================================================
// SUBMIT REVIEW
// Private API
//
// POST /api/reviews
//
// Body:
// {
//   product,
//   rating,
//   comment
// }
//
// Backend validations:
// - user must be logged in
// - must have purchased product
// - one review per user per product
// ============================================================

export const submitReview = async ({
  product,
  rating,
  comment,
}) => {

  const res = await api.post(
    '/reviews',
    {
      product,
      rating,
      comment,
    }
  );

  return res.data;
};