// ============================================================
// REVIEW LIST COMPONENT
// ============================================================

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  loadReviews,
} from '../../features/reviews/reviewSlice';

import Rating from './Rating';



const ReviewList = ({ productId }) => {

  // ==========================================================
  // REDUX
  // ==========================================================

  const dispatch = useDispatch();

  const {
    list,
    loading,
    error,
    page,
    pages,
    total,
  } = useSelector(
    (state) => state.reviews
  );



  // ==========================================================
  // LOAD REVIEWS ON MOUNT / PRODUCT CHANGE
  // ==========================================================

  useEffect(() => {

    dispatch(
      loadReviews({
        productId,
        page: 1,
      })
    );

  }, [dispatch, productId]);



  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {

    return (
      <p className='text-sm text-gray-500'>
        Loading reviews...
      </p>
    );
  }



  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {

    return (
      <p className='text-sm text-red-600'>
        {error}
      </p>
    );
  }



  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (total === 0) {

    return (
      <p className='text-sm text-gray-500'>
        No reviews yet — be the first to review this product.
      </p>
    );
  }



  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className='space-y-4'>

      {/* ==================================================== */}
      {/* TOTAL REVIEWS */}
      {/* ==================================================== */}

      <p className='text-sm text-gray-500'>
        {total} review(s)
      </p>



      {/* ==================================================== */}
      {/* REVIEW CARDS */}
      {/* ==================================================== */}

      {list.map((review) => (

        <div
          key={review._id}
          className='
            bg-white
            border border-gray-200
            rounded-2xl
            p-5
          '
        >

          {/* ================================================ */}
          {/* HEADER */}
          {/* ================================================ */}

          <div className='flex items-center justify-between'>

            <p className='font-semibold text-gray-900'>

              {review.user?.name || 'Anonymous'}

            </p>

            <span className='text-xs text-gray-400'>

              {new Date(review.createdAt)
                .toLocaleDateString('en-IN')}

            </span>

          </div>



          {/* ================================================ */}
          {/* STAR RATING */}
          {/* ================================================ */}

          <div className='mt-1'>

            <Rating
              value={review.rating}
              size='sm'
            />

          </div>



          {/* ================================================ */}
          {/* COMMENT */}
          {/* ================================================ */}

          <p
            className='
              mt-2
              text-sm
              text-gray-700
              whitespace-pre-line
            '
          >

            {review.comment}

          </p>

        </div>
      ))}



      {/* ==================================================== */}
      {/* PAGINATION */}
      {/* ==================================================== */}

      {pages > 1 && (

        <div className='flex gap-2 justify-center pt-2'>

          {Array.from(
            { length: pages },
            (_, index) => index + 1
          ).map((p) => (

            <button
              key={p}

              onClick={() =>
                dispatch(
                  loadReviews({
                    productId,
                    page: p,
                  })
                )
              }

              className={`
                w-9
                h-9
                rounded-lg
                text-sm
                font-medium
                border
                transition

                ${
                  p === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }
              `}
            >

              {p}

            </button>
          ))}

        </div>
      )}

    </div>
  );
};



// ============================================================
// EXPORT COMPONENT
// ============================================================

export default ReviewList;