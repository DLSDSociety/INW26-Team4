import { useSelector } from 'react-redux';

import {
  Link,
} from 'react-router-dom';

import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  ArrowRight,
  Package,
} from 'lucide-react';

import {
  selectWishlistCount,
} from '../features/wishlist/wishlistSlice';

import {
  selectCartCount,
} from '../features/cart/cartSlice';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const orders = useSelector(
    (state) => state.orders?.orders || []
  );

  const wishlistCount = useSelector(
    selectWishlistCount
  );

  const cartCount = useSelector(
    selectCartCount
  );

  const stats = [
    {
      label: 'Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700',
      to: '/orders',
    },
    {
      label: 'Wishlist',
      value: wishlistCount,
      icon: Heart,
      color: 'bg-purple-50 text-purple-700',
      to: '/wishlist',
    },
    {
      label: 'Cart Items',
      value: cartCount,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-700',
      to: '/cart',
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 xl:px-16 py-10">
      <div className="max-w-[1440px] mx-auto space-y-16">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ACCOUNT OVERVIEW */}
          <Link
            to="/account"
            className="
              lg:col-span-8
              rounded-[10px]
              bg-[#F8F9FA]
              p-8 md:p-12
              block
              transition-all duration-300
              hover:shadow-[0_20px_50px_rgba(95,94,94,0.04)]
            "
          >
            <div className="flex items-start justify-between gap-6">

              <div>

                <p
                  className="
                    text-[12px]
                    uppercase
                    tracking-[0.18em]
                    font-semibold
                    text-[#777683]
                    mb-6
                  "
                >
                  Account Overview
                </p>

                <h1
                  className="
                    text-4xl md:text-6xl
                    font-semibold
                    tracking-[-0.04em]
                    leading-[1.05]
                    text-[#191C1D]
                  "
                >
                  Welcome back,
                  <br />
                  {user?.name}
                </h1>

                <p
                  className="
                    mt-6
                    max-w-2xl
                    text-[16px]
                    leading-7
                    text-[#464652]
                  "
                >
                  Manage your profile, saved addresses,
                  account security, and order history
                  through your personalized account center.
                </p>

                <div className="mt-10">
                  <span
                    className="
                      inline-flex items-center gap-2
                      rounded-[10px]
                      bg-[#15157D]
                      px-6 py-3
                      text-sm font-medium text-white
                    "
                  >
                    Open Account Settings
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>

              {/* AVATAR */}
              <div
                className="
                  hidden md:flex
                  w-20 h-20
                  rounded-full
                  bg-white
                  items-center justify-center
                  shrink-0
                "
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="
                      w-full
                      h-full
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <span
                    className="
                      text-2xl
                      font-semibold
                      text-[#15157D]
                    "
                  >
                    {(user?.name?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* MEMBERSHIP PANEL */}
          <div
            className="
              lg:col-span-4
              rounded-[10px]
              bg-[#191C1D]
              text-white
              p-8
              flex flex-col justify-between
            "
          >
            <div>

              <p
                className="
                  text-[12px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-white/60
                "
              >
                Membership
              </p>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                "
              >
                Premium Account
              </h2>

              <p className="mt-4 leading-7 text-white/70">
                Personalized recommendations,
                priority support, and seamless
                order management.
              </p>
            </div>

            <div className="pt-10">

              <div className="h-px bg-white/10 mb-6" />

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-white/50">
                    Registered User
                  </p>

                  <p className="mt-1 font-medium break-all">
                    {user?.email}
                  </p>
                </div>

                <div
                  className="
                    w-12 h-12
                    rounded-full
                    bg-white/10
                    flex items-center justify-center
                  "
                >
                  <Package size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section>

          <div className="mb-8">

            <p
              className="
                text-[12px]
                uppercase
                tracking-[0.18em]
                font-semibold
                text-[#777683]
              "
            >
              Activity Metrics
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-medium
                tracking-[-0.02em]
                text-[#191C1D]
              "
            >
              Shopping Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {stats.map((item) => {
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="
                    group
                    rounded-[10px]
                    bg-[#F8F9FA]
                    p-8
                    transition-all duration-300
                    hover:shadow-[0_20px_50px_rgba(95,94,94,0.04)]
                    hover:-translate-y-1
                    block
                  "
                >
                  <div className="flex items-start justify-between">

                    <div>

                      <div
                        className={`
                          inline-flex
                          items-center
                          px-3 py-1
                          rounded-full
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          ${item.color}
                        `}
                      >
                        {item.label}
                      </div>

                      <h3
                        className="
                          mt-5
                          text-5xl
                          font-semibold
                          tracking-[-0.04em]
                          text-[#191C1D]
                        "
                      >
                        {item.value}
                      </h3>

                      <p
                        className="
                          mt-4
                          text-sm
                          text-[#777683]
                          flex items-center gap-2
                        "
                      >
                        Open
                        <ArrowRight
                          size={16}
                          className="
                            transition-transform
                            group-hover:translate-x-1
                          "
                        />
                      </p>
                    </div>

                    <div
                      className="
                        w-12 h-12
                        rounded-[10px]
                        bg-white
                        flex items-center justify-center
                      "
                    >
                      <IconComponent
                        size={22}
                        className="text-[#15157D]"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section
          className="
            rounded-[10px]
            bg-[#F8F9FA]
            p-8 md:p-10
          "
        >
          <div className="flex items-center justify-between">

            <div>

              <p
                className="
                  text-[12px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#777683]
                "
              >
                Recent Activity
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-medium
                  tracking-[-0.02em]
                  text-[#191C1D]
                "
              >
                Latest Updates
              </h2>
            </div>

            <Link
              to="/orders"
              className="
                text-sm
                font-medium
                text-[#15157D]
                hover:underline
              "
            >
              View All
            </Link>
          </div>

          <div
            className="
              mt-10
              rounded-[10px]
              bg-white
              p-16
              text-center
            "
          >
            <p className="text-lg text-[#777683]">
              No recent activity available.
            </p>

            <Link
              to="/products"
              className="
                inline-flex items-center gap-2
                mt-6
                text-sm
                font-medium
                text-[#15157D]
                hover:underline
              "
            >
              Explore Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;