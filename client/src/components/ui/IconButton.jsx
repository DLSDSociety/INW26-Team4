/**
 * Round icon button with optional badge counter (for the cart).
 */
const IconButton = ({ children, count, ariaLabel, onClick }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className="relative w-10 h-10 flex items-center justify-center
               rounded-full text-on-surface hover:bg-surface-3 transition"
  >
    {children}
    {count > 0 && (
      <span
        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                   rounded-full bg-primary text-white text-[10px]
                   font-semibold flex items-center justify-center"
      >
        {count}
      </span>
    )}
  </button>
);

export default IconButton;