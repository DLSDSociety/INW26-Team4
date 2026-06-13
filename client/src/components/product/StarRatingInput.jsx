// ============================================================
// STAR RATING INPUT COMPONENT
// Controlled component
//
// Props:
// - value      -> selected rating (1–5)
// - onChange   -> callback when rating changes
// ============================================================

import { useState } from 'react';

const StarRatingInput = ({
  value,
  onChange,
}) => {

  // ==========================================================
  // Hover state
  // Used for live star preview
  // ==========================================================

  const [hover, setHover] = useState(0);



  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className='flex gap-1'>

      {[1, 2, 3, 4, 5].map((star) => (

        <button
          key={star}
          type='button'

          // --------------------------------------------------
          // Select rating
          // --------------------------------------------------

          onClick={() => onChange(star)}

          // --------------------------------------------------
          // Hover preview
          // --------------------------------------------------

          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}

          // --------------------------------------------------
          // Styling
          // --------------------------------------------------

          className='text-2xl leading-none focus:outline-none'

          // --------------------------------------------------
          // Accessibility
          // --------------------------------------------------

          aria-label={`${star} star`}
        >

          <span
            className={
              (hover || value) >= star
                ? 'text-yellow-400'
                : 'text-gray-300'
            }
          >
            ★
          </span>

        </button>
      ))}

    </div>
  );
};



// ============================================================
// EXPORT COMPONENT
// ============================================================

export default StarRatingInput;