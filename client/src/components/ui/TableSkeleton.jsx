import Skeleton from './Skeleton';
 
// Renders `rows` x `cols` grey cells inside a card.
// Reused by every admin table while its data loads.
const TableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <Skeleton className="h-5 w-40" />
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
 
export default TableSkeleton;

