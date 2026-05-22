import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
} from '../features/wishlist/wishlistSlice';

import { addItem } from '../features/cart/cartSlice';

import Loader from '../components/common/Loader';
import Rating from '../components/product/Rating';

const PLACEHOLDER =
  'https://via.placeholder.com/600x800?text=No+Image';

const WishlistPage = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectWishlistItems);

  const loading = useSelector(
    (state) => state.wishlist.loading
  );

  const error = useSelector(
    (state) => state.wishlist.error
  );

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const handleMoveToCart = (product) => {
    dispatch(
      addItem({
        product: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || '',
        stock: product.stock || 10,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(product._id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Remove all items from your wishlist?'
      )
    ) {
      dispatch(clearWishlist());
    }
  };

  // Loading State
  if (loading && items.length === 0) {
    return <Loader />;
  }

  // Empty State
  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-24">
        <p
          className="text-xs uppercase tracking-[0.28em]
                     text-gray-400 mb-4"
        >
          Personal Archive
        </p>

        <h1
          className="text-5xl md:text-6xl font-semibold
                     tracking-tight text-charcoal mb-6"
        >
          Saved Collection
        </h1>

        <p
          className="text-gray-500 leading-relaxed
                     max-w-2xl mb-10"
        >
          No saved pieces yet. Explore curated collections
          and preserve products for later consideration.
        </p>

        <Link
          to="/products"
          className="inline-flex items-center justify-center
                     bg-charcoal text-white
                     px-8 py-4 rounded-full
                     text-sm uppercase tracking-wide
                     hover:bg-black transition-all duration-300"
        >
          Explore Collection
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      {/* Header */}
      <div className="mb-16">
        <div
          className="flex flex-col lg:flex-row
                     lg:items-end lg:justify-between gap-8"
        >
          <div>
            <p
              className="text-xs uppercase tracking-[0.28em]
                         text-gray-400 mb-5"
            >
              Personal Archive
            </p>

            <h1
              className="text-5xl md:text-6xl font-semibold
                         tracking-tight text-charcoal"
            >
              Saved Collection
            </h1>

            <p
              className="mt-6 text-gray-500 leading-relaxed
                         max-w-2xl"
            >
              Curated products preserved for future purchase
              and editorial exploration.
            </p>
          </div>

          <div
            className="flex items-center gap-6
                       text-sm text-gray-400"
          >
            <span>
              {items.length} saved
              {items.length > 1 ? ' pieces' : ' piece'}
            </span>

            <button
              onClick={handleClearAll}
              className="uppercase tracking-[0.2em]
                         hover:text-red-500 transition"
            >
              Clear Archive
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-8 bg-red-50 border border-red-200
                     text-red-600 rounded-2xl px-5 py-4"
        >
          {error}
        </div>
      )}

      {/* Wishlist Items */}
      <div className="space-y-8">
        {items.map((product) => {
          const img =
            product.images?.[0] || PLACEHOLDER;

          const inStock = product.stock > 0;

          return (
            <div
              key={product._id}
              className="group bg-white border border-gray-200
                         rounded-[32px] overflow-hidden
                         hover:border-gray-300
                         transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Product Image */}
                <Link
                  to={`/products/${product._id}`}
                  className="lg:w-[340px] shrink-0
                             bg-gray-100 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-[360px] lg:h-full
                               object-cover
                               transition-transform duration-700
                               group-hover:scale-[1.03]"
                  />
                </Link>

                {/* Product Content */}
                <div
                  className="flex-1 p-8 lg:p-12
                             flex flex-col justify-between"
                >
                  <div>
                    {/* Category */}
                    <p
                      className="text-xs uppercase
                                 tracking-[0.24em]
                                 text-gray-400 mb-5"
                    >
                      {product.category}
                    </p>

                    {/* Name */}
                    <Link
                      to={`/products/${product._id}`}
                    >
                      <h2
                        className="text-3xl md:text-4xl
                                   font-semibold tracking-tight
                                   text-charcoal
                                   hover:text-black transition"
                      >
                        {product.name}
                      </h2>
                    </Link>

                    {/* Rating */}
                    <div className="mt-6">
                      <Rating
                        value={product.rating}
                        count={product.numReviews}
                        size="sm"
                      />
                    </div>

                    {/* Price */}
                    <p
                      className="mt-8 text-3xl
                                 font-medium text-charcoal"
                    >
                      ₹
                      {Number(product.price).toLocaleString(
                        'en-IN'
                      )}
                    </p>

                    {/* Description */}
                    <p
                      className="mt-6 text-gray-500
                                 leading-relaxed max-w-2xl"
                    >
                      Preserved in your personal archive
                      for future purchase and curated
                      collection review.
                    </p>

                    {/* Stock */}
                    <div className="mt-6">
                      {inStock ? (
                        <span
                          className="text-xs uppercase
                                     tracking-wide
                                     text-green-600"
                        >
                          Available for purchase
                        </span>
                      ) : (
                        <span
                          className="text-xs uppercase
                                     tracking-wide
                                     text-red-500"
                        >
                          Currently unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex flex-wrap items-center
                               gap-4 mt-12"
                  >
                    <button
                      onClick={() =>
                        handleMoveToCart(product)
                      }
                      disabled={!inStock}
                      className="bg-charcoal text-white
                                 px-8 py-4 rounded-full
                                 text-sm uppercase
                                 tracking-wide
                                 hover:bg-black
                                 transition-all duration-300
                                 disabled:bg-gray-300
                                 disabled:cursor-not-allowed"
                    >
                      Move to Cart
                    </button>

                    <button
                      onClick={() =>
                        handleRemove(product._id)
                      }
                      className="text-sm uppercase
                                 tracking-wide
                                 text-gray-500
                                 hover:text-red-500
                                 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WishlistPage;