import ProductCard from './ProductCard';
 
const SkeletonCard = () => (
  <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse'>
    <div className='aspect-square bg-gray-200' />
    <div className='p-4 space-y-3'>
      <div className='h-3 bg-gray-200 rounded w-1/3' />
      <div className='h-4 bg-gray-200 rounded w-3/4' />
      <div className='h-5 bg-gray-200 rounded w-1/2' />
    </div>
  </div>
);
 
const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
 
  if (!products || products.length === 0) {
    return (
      <div className='text-center py-20 text-gray-500'>
        <p className='text-lg font-medium'>No products found</p>
        <p className='text-sm mt-1'>Try adjusting your filters.</p>
      </div>
    );
  }
 
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
};
 
export default ProductGrid;

