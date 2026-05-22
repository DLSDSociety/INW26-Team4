import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import WishlistButton from '../wishlist/WishlistButton';


const ProductCard = ({ product }) => {
  const img = product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x750';

  return (
    <Link to={`/products/${product._id}`} className="group block">
      {/* Image — 4:5 aspect, no border, soft hover lift */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-soft bg-surface-3">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Status badge */}
        {product.isNew && (
          <Badge className="absolute top-4 left-4">New</Badge>
        )}
        {product.isLimited && (
          <Badge variant="indigo" className="absolute top-4 left-4">Limited</Badge>
        )}
      </div>

      {/* Body — minimal, editorial */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-[0.05em] text-charcoal leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-on-surface-2 whitespace-nowrap">
          ₹{product.price.toLocaleString('en-US')}
        </p>
      </div>

      <div className='relative aspect-square bg-gray-50 overflow-hidden'>
  <img
    src={img}
    alt={product.name}
    className='w-full h-full object-cover group-hover:scale-105 transition'
    loading='lazy'
  />
 
  {/* heart overlay — top right */}
  <div className='absolute top-2 right-2'>
    <WishlistButton productId={product._id} size='sm' />
  </div>
</div>


      {product.colorName && (
        <p className="mt-1 text-sm text-on-surface-2 italic">{product.colorName}</p>
      )}
    </Link>
  );
};

export default ProductCard;