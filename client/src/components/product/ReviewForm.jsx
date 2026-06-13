// ============================================================
// REVIEW FORM COMPONENT
// ============================================================

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StarRatingInput from './StarRatingInput';

import {
  postReview,
  loadReviews,
} from '../../features/reviews/reviewSlice';



const ReviewForm = ({ productId }) => {

  // ==========================================================
  // REDUX
  // ==========================================================

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    submitting,
    submitError,
  } = useSelector(
    (state) => state.reviews
  );



  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');



  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!user) {
    return (

      <div className='bg-white border border-gray-200 rounded-2xl p-6'>

        <p className='text-sm text-gray-500'>
          Please log in to write a review.
        </p>

      </div>
    );
  }



  // ==========================================================
  // SUBMIT REVIEW
  // ==========================================================

  const handleSubmit = async () => {

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (rating < 1 || !comment.trim()) {
      return;
    }



    // --------------------------------------------------------
    // Dispatch review action
    // --------------------------------------------------------

    const result = await dispatch(

      postReview({
        product: productId,
        rating,
        comment: comment.trim(),
      })
    );



    // --------------------------------------------------------
    // Success
    // Reset form + reload reviews
    // --------------------------------------------------------

    if (postReview.fulfilled.match(result)) {

      setRating(0);

      setComment('');

      dispatch(
        loadReviews({
          productId,
          page: 1,
        })
      );
    }
  };



  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className='bg-white border border-gray-200 rounded-2xl p-6'>

      {/* ==================================================== */}
      {/* TITLE */}
      {/* ==================================================== */}

      <h3 className='font-bold text-gray-900 mb-4'>
        Write a review
      </h3>



      {/* ==================================================== */}
      {/* ERROR MESSAGE */}
      {/* ==================================================== */}

      {submitError && (

        <div
          className='
            bg-red-50
            border border-red-200
            text-red-700
            rounded-lg
            px-4 py-3
            mb-4
            text-sm
          '
        >
          {submitError}
        </div>
      )}



      {/* ==================================================== */}
      {/* STAR RATING */}
      {/* ==================================================== */}

      <div className='mb-4'>

        <p className='text-sm font-medium text-gray-700 mb-1'>
          Your rating
        </p>

        <StarRatingInput
          value={rating}
          onChange={setRating}
        />

      </div>



      {/* ==================================================== */}
      {/* COMMENT INPUT */}
      {/* ==================================================== */}

      <textarea
        rows='4'

        value={comment}

        onChange={(e) =>
          setComment(e.target.value)
        }

        placeholder='Share your experience with this product...'

        className='
          w-full
          border border-gray-300
          rounded-lg
          px-3 py-2
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        '
      />



      {/* ==================================================== */}
      {/* SUBMIT BUTTON */}
      {/* ==================================================== */}

      <button
        onClick={handleSubmit}

        disabled={
          submitting ||
          rating < 1 ||
          !comment.trim()
        }

        className='
          mt-4
          bg-blue-600
          text-white
          px-5 py-2.5
          rounded-lg
          font-semibold
          hover:bg-blue-700
          transition
          disabled:opacity-60
        '
      >

        {submitting
          ? 'Submitting...'
          : 'Submit Review'}

      </button>

    </div>
  );
};



// ============================================================
// EXPORT COMPONENT
// ============================================================

export default ReviewForm;