import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { subscribe } from '../features/newsletter/newsletterAPI';

import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';

import FeaturedCollections from '../components/home/FeaturedCollections';

import { loadProducts } from '../features/products/productSlice';

const HomePage = () => {
  const dispatch = useDispatch();

  const {
    list: products,
    loading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  // Highest Rated Products
  const trending =
    products?.length > 0
      ? [...products]
          .sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;

            const reviewsA = a.numReviews || 0;
            const reviewsB = b.numReviews || 0;

            if (ratingB === ratingA) {
              return reviewsB - reviewsA;
            }

            return ratingB - ratingA;
          })
          .slice(0, 4)
      : [];

      const [nlEmail, setNlEmail] = useState('');
const [nlStatus, setNlStatus] = useState({ kind: 'idle', msg: '' });

const handleNewsletter = async (e) => {
  e.preventDefault();
  if (!nlEmail) return;
  setNlStatus({ kind: 'loading', msg: '' });
  try {
    const { message } = await subscribe(nlEmail, 'homepage');
    setNlStatus({ kind: 'success', msg: message });
    setNlEmail('');
  } catch (err) {
    setNlStatus({
      kind: 'error',
      msg: err.response?.data?.message || 'Subscription failed',
    });
  }
};

  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] overflow-hidden">

  {/* Background Image */}
  <img
    src="/hero-editorial.jpg"
    alt="Editorial Fashion"
    className="
      absolute inset-0
      w-full h-full
      object-cover
    "
  />

  {/* Dark Overlay */}
  <div
    className="
      absolute inset-0
      bg-gradient-to-r
      from-black/80
      via-black/55
      to-black/20
    "
  />

  {/* Content */}
  <div
    className="
      relative z-10
      max-w-container
      mx-auto
      h-full
      px-margin-desktop
      flex items-center
    "
  >
    <div className="max-w-2xl">

      {/* Label */}
      <p
        className="
          text-xs
          tracking-[0.25em]
          uppercase
          text-white/70
          mb-6
        "
      >
        MERN Commerce Platform
      </p>

      {/* Heading */}
      <h1
        className="
          text-6xl md:text-7xl
          font-semibold
          tracking-[-0.06em]
          leading-[0.92]
          text-white
        "
      >
       Curated Commerce <br />
        Engineered with Precision
      </h1>

      {/* Description */}
      <p
        className="
          mt-8
          max-w-xl
          text-lg
          leading-relaxed
          text-white/75
        "
      >
        A full-stack luxury commerce platform built
with the MERN stack — combining editorial
design, secure payments, intelligent state
management, and a seamless shopping experience.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap gap-4">

        <Link to="/products">
          <button
            className="
              h-14
              px-8
              rounded-2xl
              bg-white
              text-black
              text-sm
              font-medium
              uppercase
              tracking-[0.08em]
              hover:bg-neutral-200
              transition-all
            "
          >
            Explore Collection
          </button>
        </Link>

        <Link to="/editorial">
          <button
            className="
              h-14
              px-8
              rounded-2xl
              border border-white/40
              text-white
              text-sm
              font-medium
              uppercase
              tracking-[0.08em]
              backdrop-blur-sm
              hover:bg-white hover:text-black
              transition-all
            "
          >
            View Platform
          </button>
        </Link>
      </div>

      {/* Luxury Tags */}
      <div className="mt-12 flex flex-wrap gap-3">

        <div
          className="
            px-4 py-2
            rounded-full
            bg-white/10
            backdrop-blur-md
            border border-white/10
            text-xs
            uppercase
            tracking-[0.12em]
            text-white/80
          "
        >
          Editorial Design
        </div>

        <div
          className="
            px-4 py-2
            rounded-full
            bg-white/10
            backdrop-blur-md
            border border-white/10
            text-xs
            uppercase
            tracking-[0.12em]
            text-white/80
          "
        >
          Razorpay Integration
        </div>

        <div
          className="
            px-4 py-2
            rounded-full
            bg-white/10
            backdrop-blur-md
            border border-white/10
            text-xs
            uppercase
            tracking-[0.12em]
            text-white/80
          "
        >
          Modern MERN Stack
        </div>

      </div>
    </div>
  </div>
</section>

      {/* FEATURED COLLECTIONS */}
      <FeaturedCollections />

      {/* TRENDING PRODUCTS */}
      <section
        className="max-w-container
                   mx-auto
                   px-margin-mobile
                   md:px-margin-tablet
                   xl:px-margin-desktop
                   py-24"
      >
        <div className="flex items-end justify-between mb-12">

          <div>

            <p className="label-editorial mb-3">
              Curated Selection
            </p>

            <h2 className="text-headline-md text-charcoal">
              Trending Now
            </h2>
          </div>

          <Link
            to="/products"
            className="link-underline
                       text-sm
                       font-medium
                       text-charcoal"
          >
            View All Products
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            className="rounded-soft
                       bg-surface-2
                       p-20
                       text-center"
          >
            <p className="text-on-surface-2">
              Loading curated products...
            </p>
          </div>
        ) : trending.length === 0 ? (
          /* Empty State */
          <div
            className="rounded-soft
                       bg-surface-2
                       p-20
                       text-center"
          >
            <p className="text-on-surface-2">
              No featured products available.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {trending.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* EDITORIAL SECTION */}
      <section className="bg-surface py-32">

        <div
          className="max-w-container
                     mx-auto
                     px-margin-mobile
                     md:px-margin-tablet
                     xl:px-margin-desktop"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Editorial Image */}
            <div
  className="relative
             overflow-hidden
             rounded-soft
             bg-[#E8E8E6]"
>
  <img
    src="/editorial.jpg"
    alt="Editorial"
    className="w-full h-[520px] md:h-[620px] object-cover"
  />
</div>

            {/* Editorial Content */}
            <div>

              <p className="label-editorial mb-5">
                Editorial Story
              </p>

              <h2
                className="text-display-lg-mobile
                           md:text-headline-md
                           text-charcoal"
              >
                Crafted for
                <br />
                Modern Precision
              </h2>

              <p
                className="mt-8
                           text-body-lg
                           text-on-surface-2
                           leading-8
                           max-w-lg"
              >
                Every garment is designed with
                architectural tailoring, premium
                natural fibers, and restrained
                detailing for timeless versatility.
              </p>

              <div className="mt-10">

                <Link to="/editorial">
                  <Button variant="primary">
                    Read Editorial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-surface-3 py-24">

        <div
          className="max-w-2xl
                     mx-auto
                     px-margin-mobile
                     md:px-margin-tablet
                     text-center"
        >
          <p className="label-editorial mb-4">
            The Sartorial Journal
          </p>

          <h2 className="text-headline-md text-charcoal">
            Stay informed on new releases
            and private boutique events.
          </h2>

         <form onSubmit={handleNewsletter} className="mt-8 flex gap-2 max-w-md mx-auto">
  <input
    type="email"
    required
    value={nlEmail}
    onChange={(e) => setNlEmail(e.target.value)}
    placeholder="you@example.com"
    className="flex-1 px-4 py-3 rounded-soft bg-white border border-outline-soft
               text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
  />
  <Button variant="primary" type="submit" disabled={nlStatus.kind === 'loading'}>
    {nlStatus.kind === 'loading' ? 'Subscribing…' : 'Subscribe'}
  </Button>
</form>
{nlStatus.msg && (
  <p className={`mt-3 text-xs ${nlStatus.kind === 'error' ? 'text-red-600' : 'text-on-surface-2'}`}>
    {nlStatus.msg}
  </p>
)}
        </div>
      </section>
    </>
  );
};

export default HomePage;