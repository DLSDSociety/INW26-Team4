import Skeleton from './Skeleton';
 
// label  : 'Total Revenue'
// value  : already-formatted string e.g. '₹1,24,500'
// loading: show a shimmer instead of the value
const StatCard = ({ label, value, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {loading ? (
      <Skeleton className="h-8 w-28 mt-3" />
    ) : (
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    )}
  </div>
);
 
export default StatCard;

