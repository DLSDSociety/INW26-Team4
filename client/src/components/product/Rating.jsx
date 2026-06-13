/**
 * <Rating value={4.3} count={27} />
 * Renders 5 stars with a partial fill, optionally followed by review count.
 */
const Rating = ({ value = 0, count, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
 
  return (
    <div className={`flex items-center gap-1 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, value - star + 1));
        return (
          <span key={star} className='relative inline-block'>
            <span className='text-gray-300'>★</span>
            <span
              className='absolute left-0 top-0 overflow-hidden text-yellow-400'
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
          </span>
        );
      })}
      {typeof count === 'number' && (
        <span className='ml-2 text-gray-500 text-sm'>({count})</span>
      )}
    </div>
  );
};
 
export default Rating;

