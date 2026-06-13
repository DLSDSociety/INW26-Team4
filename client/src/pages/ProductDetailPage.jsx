import { useEffect, useMemo, useState } from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  ChevronLeft,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';

import Button from '../components/ui/Button';
import WishlistButton from '../components/wishlist/WishlistButton';

import {
  loadProductById,
} from '../features/products/productSlice';

import {
  addItem,
} from '../features/cart/cartSlice';

const ProductDetailsPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // QUANTITY
  const [qty, setQty] = useState(1);

  // IMAGE SELECTOR
  const [selectedImage, setSelectedImage] = useState(0);

  // REVIEW STATE
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');

  // PRODUCT STATE
  const {
    current: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  // AUTH
  const { user } = useSelector((state) => state.auth);

  // LOAD PRODUCT
  useEffect(() => {
    dispatch(loadProductById(id));
  }, [dispatch, id]);

  // SAFE REVIEWS
  const reviews = product?.reviews || [];

  // SAFE IMAGE ARRAY
  const images = useMemo(() => {
    if (!product) return [];

    if (product.images?.length > 0) {
      return product.images;
    }

    return [
      product.image,
      product.image,
      product.image,
    ].filter(Boolean);
  }, [product]);

const inStock = product?.stock > 0;

  // QTY INCREASE
  const increaseQty = () => {
  if (qty < (product?.stock || 1)) {
    setQty((prev) => prev + 1);
  }
};

  // QTY DECREASE
  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  // ADD TO CART
const addToCartHandler = () => {
  dispatch(
    addItem({
      product:  product._id,
      name:     product.name,
      image:    images[0],
      price:    Number(product.price),
      stock:    product.stock,
      quantity: Number(qty),
    })
  );
  navigate('/cart');
};

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#777683] text-sm tracking-wide">
          Loading product...
        </p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-sm">
          {error}
        </p>
      </div>
    );
  }

  // EMPTY
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#777683] text-sm">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div
        className="
          max-w-[1440px]
          mx-auto
          px-4 md:px-8 xl:px-16
          py-10
        "
      >
        {/* BACK BUTTON */}
        <Link
          to="/products"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-[#666]
            hover:text-black
            transition-all
          "
        >
          <ChevronLeft size={16} />
          Back to products
        </Link>

        {/* MAIN GRID */}
        <div
          className="
            grid grid-cols-1 lg:grid-cols-12
            gap-14
            mt-10
          "
        >
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-[90px_1fr] gap-5">

              {/* THUMBNAILS */}
              <div className="flex flex-col gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      overflow-hidden
                      rounded-[12px]
                      border
                      transition-all
                      ${
                        selectedImage === index
                          ? 'border-black'
                          : 'border-[#E5E5E5]'
                      }
                    `}
                  >
                    <img
                      src={img}
                      alt={product.name}
                      className="
                        w-full
                        aspect-square
                        object-cover
                      "
                    />
                  </button>
                ))}
              </div>

              {/* MAIN IMAGE */}
              <div
                className="
                  overflow-hidden
                  rounded-[18px]
                  bg-[#F8F9FA]
                "
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="
                    w-full
                    h-[720px]
                    object-cover
                  "
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">

              {/* CATEGORY */}
              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#8A8A8A]
                  mb-4
                "
              >
                {product.category || 'Collection'}
              </p>

              {/* TITLE */}
              <h1
                className="
                  text-4xl md:text-5xl
                  font-semibold
                  tracking-[-0.04em]
                  leading-[1.05]
                  text-[#191C1D]
                "
              >
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(product.rating || 0)
                          ? 'fill-black text-black'
                          : 'text-[#D1D5DB]'
                      }
                    />
                  ))}
                </div>

                <p className="text-sm text-[#777683]">
                  {product.numReviews || 0} reviews
                </p>
              </div>

              {/* PRICE */}
              <div className="mt-8">
                <h2
                  className="
                    text-4xl
                    font-semibold
                    tracking-[-0.03em]
                    text-[#191C1D]
                  "
                >
                  ₹{product.price?.toLocaleString()}
                </h2>

                {inStock ? (
                  <p className="mt-3 text-sm text-green-600">
                    In stock ({product.stock || 0} available)
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-red-500">
                    Out of stock
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="mt-10">
                <p
                  className="
                    text-[16px]
                    leading-8
                    text-[#464652]
                  "
                >
                  {product.description}
                </p>
              </div>

              {/* FEATURES */}
              <div
                className="
                  mt-10
                  space-y-4
                  border-t border-[#E5E5E5]
                  pt-8
                "
              >
                <div className="flex items-center gap-3 text-sm text-[#464652]">
                  <ShieldCheck size={18} />
                  Premium craftsmanship guarantee
                </div>

                <div className="flex items-center gap-3 text-sm text-[#464652]">
                  <Truck size={18} />
                  Complimentary worldwide shipping
                </div>

                <div className="flex items-center gap-3 text-sm text-[#464652]">
                  <RotateCcw size={18} />
                  14-day returns and exchanges
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-12">

                {inStock ? (
                  <div className="flex items-center gap-4">

                    {/* QUANTITY */}
                    <div
                      className="
                        flex items-center
                        border border-[#E5E5E5]
                        rounded-[12px]
                        overflow-hidden
                      "
                    >
                      <button
                        onClick={decreaseQty}
                        className="
                          w-12 h-12
                          flex items-center justify-center
                          hover:bg-[#F5F5F5]
                          transition-all
                        "
                      >
                        <Minus size={16} />
                      </button>

                      <div
                        className="
                          w-12 h-12
                          flex items-center justify-center
                          text-sm font-medium
                        "
                      >
                        {qty}
                      </div>

                      <button
                        onClick={increaseQty}
                        className="
                          w-12 h-12
                          flex items-center justify-center
                          hover:bg-[#F5F5F5]
                          transition-all
                        "
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <Button
                      onClick={addToCartHandler}
                      className="
                        flex-1
                        !bg-[#191C1D]
                        hover:!bg-black
                        !text-white
                        !rounded-[12px]
                        !h-12
                      "
                    >
                      Add to Cart
                    </Button>

                    {/* WISHLIST */}
                    <WishlistButton
                      productId={product._id}
                      size="md"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">

                    <div
                      className="
                        inline-flex
                        items-center
                        px-4 py-2
                        rounded-[12px]
                        bg-red-50
                        text-red-600
                        text-sm
                        font-medium
                      "
                    >
                      Out of Stock
                    </div>

                    <div>
                      <WishlistButton
                        productId={product._id}
                        size="md"
                      />

                      <p className="text-sm text-[#777683] mt-3">
                        Save for later — we will email you when it is back.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <section
          className="
            mt-28
            border-t border-[#E5E5E5]
            pt-16
          "
        >
          <div className="max-w-4xl">

            {/* LABEL */}
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.18em]
                font-semibold
                text-[#8A8A8A]
                mb-4
              "
            >
              Customer Feedback
            </p>

            {/* TITLE */}
            <h2
              className="
                text-3xl
                font-semibold
                tracking-[-0.03em]
                text-[#191C1D]
              "
            >
              Reviews
            </h2>

            {/* REVIEWS */}
            {reviews.length === 0 ? (
              <div
                className="
                  mt-10
                  rounded-[16px]
                  bg-[#F8F9FA]
                  p-8
                "
              >
                <p className="text-[#777683]">
                  No reviews yet — be the first to review this product.
                </p>
              </div>
            ) : (
              <div className="mt-10 space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="
                      rounded-[16px]
                      bg-[#F8F9FA]
                      p-8
                    "
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <h3 className="font-medium text-[#191C1D]">
                          {review.name}
                        </h3>

                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= review.rating
                                  ? 'fill-black text-black'
                                  : 'text-[#D1D5DB]'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-[#777683]">
                        {review.createdAt?.substring(0, 10)}
                      </p>
                    </div>

                    <p
                      className="
                        mt-5
                        leading-7
                        text-[#464652]
                      "
                    >
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* REVIEW FORM */}
            <div
              className="
                mt-16
                rounded-[16px]
                border border-[#E5E5E5]
                p-8
              "
            >
              {!user ? (
                <p className="text-[#777683]">
                  Please log in to write a review.
                </p>
              ) : (
                <>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-[#191C1D]
                    "
                  >
                    Write a Review
                  </h3>

                  {/* RATING */}
                  <div className="mt-8">

                    <p
                      className="
                        text-sm
                        font-medium
                        text-[#191C1D]
                        mb-3
                      "
                    >
                      Your Rating
                    </p>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                        >
                          <Star
                            size={24}
                            className={
                              star <= rating
                                ? 'fill-black text-black'
                                : 'text-[#D1D5DB]'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COMMENT */}
                  <div className="mt-8">
                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-[#191C1D]
                        mb-3
                      "
                    >
                      Your Review
                    </label>

                    <textarea
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about the craftsmanship, fit, and overall experience."
                      className="
                        w-full
                        rounded-[12px]
                        border border-[#E5E5E5]
                        px-5 py-4
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-black/10
                      "
                    />
                  </div>

                  {/* SUBMIT */}
                  <div className="mt-8">
                    <Button
                      className="
                        !bg-[#191C1D]
                        hover:!bg-black
                        !text-white
                        !rounded-[12px]
                        !h-12
                        !px-8
                      "
                    >
                      Submit Review
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailsPage;