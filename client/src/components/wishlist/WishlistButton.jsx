import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsWishlisted,
} from '../../features/wishlist/wishlistSlice';
 
/**
 * <WishlistButton productId={id} size="sm" />
 * Heart toggle. Optimistic. Guards against guests.
 */
const WishlistButton = ({ productId, size = 'md', className = '' }) => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const isWishlisted    = useSelector(selectIsWishlisted(productId));
 
  const dimensions = size === 'sm'
    ? 'w-9 h-9 text-lg'
    : 'w-12 h-12 text-2xl';
 
  const handleClick = (e) => {
    // Stop the parent <Link> (ProductCard) from navigating.
    e.preventDefault();
    e.stopPropagation();
 
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
 
    if (isWishlisted) dispatch(removeFromWishlist(productId));
    else              dispatch(addToWishlist(productId));
  };
 
  return (
    <button
      type='button'
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
      className={`${dimensions} rounded-full flex items-center justify-center
                  bg-white/90 backdrop-blur shadow-md
                  hover:bg-white hover:scale-110
                  transition-all duration-150
                  ${className}`}
    >
      <span
        className={
          isWishlisted
            ? 'text-red-500'
            : 'text-gray-400 hover:text-red-400'
        }
      >
        {isWishlisted ? '♥' : '♡'}
      </span>
    </button>
  );
};
 
export default WishlistButton;

