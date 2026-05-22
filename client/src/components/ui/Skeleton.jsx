// A single shimmering grey block.
// Pass Tailwind sizing classes via className to shape it
// into a line, a circle, a card, etc.
const Skeleton = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse bg-gray-200 rounded ${className}`}
  />
);
 
export default Skeleton;

