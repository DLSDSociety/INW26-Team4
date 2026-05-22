import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import {
  ShoppingBag,
} from 'lucide-react';

import {
  selectCartItems,
  selectCartSubtotal,
} from '../features/cart/cartSlice';

import CartItem from '../components/cart/CartItem';

const CartPage = () => {
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);

  const subtotal = useSelector(selectCartSubtotal);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const shipping =
    subtotal > 1000 || subtotal === 0
      ? 0
      : 50;

  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate(
      isAuthenticated
        ? '/checkout'
        : '/login'
    );
  };

  // EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen">

        <div
          className="
            max-w-[900px]
            mx-auto
            px-4 md:px-8
            py-28
          "
        >
          <div
            className="
              bg-white
              rounded-[28px]
              border border-[#ECECEC]
              p-16 md:p-24
              text-center
            "
          >
            {/* ICON */}
            <div
              className="
                w-20 h-20
                rounded-full
                bg-[#F5F5F5]
                flex items-center justify-center
                mx-auto
              "
            >
              <ShoppingBag
                size={34}
                className="text-[#777683]"
              />
            </div>

            {/* TITLE */}
            <h1
              className="
                mt-10
                text-4xl md:text-5xl
                font-semibold
                tracking-[-0.04em]
                text-[#191C1D]
              "
            >
              Your cart is empty
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-5
                text-[#777683]
                text-lg
                leading-8
                max-w-xl
                mx-auto
              "
            >
              Explore curated collections and discover timeless essentials crafted for modern living.
            </p>

            {/* BUTTON */}
            <Link
              to="/products"
              className="
                inline-flex
                items-center justify-center
                mt-10
                h-14
                px-10
                rounded-[16px]
                bg-[#191C1D]
                text-white
                text-sm
                font-medium
                hover:bg-black
                transition-all
              "
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      <div
        className="
          max-w-[1440px]
          mx-auto
          px-4 md:px-8 xl:px-16
          py-14
        "
      >
        {/* HEADER */}
        <div className="mb-12">

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
            Your Selection
          </p>

          <h1
            className="
              text-4xl md:text-5xl
              font-semibold
              tracking-[-0.04em]
              text-[#191C1D]
            "
          >
            Shopping Cart
          </h1>
        </div>

        {/* GRID */}
        <div
          className="
            grid grid-cols-1
            lg:grid-cols-[1fr_420px]
            gap-8
            items-start
          "
        >
          {/* LEFT */}
          <div
            className="
              bg-white
              rounded-[28px]
              border border-[#ECECEC]
              overflow-hidden
            "
          >
            {items.map((item, index) => (
              <div
                key={item.product}
                className={
                  index !== items.length - 1
                    ? 'border-b border-[#F1F1F1]'
                    : ''
                }
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>

          {/* RIGHT SUMMARY */}
          <div
            className="
              sticky top-28
              bg-white
              rounded-[28px]
              border border-[#ECECEC]
              p-8
            "
          >
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
              Order Summary
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
              Summary
            </h2>

            {/* ROWS */}
            <div className="mt-10 space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-[#777683]">
                  Subtotal
                </span>

                <span className="font-medium text-[#191C1D]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#777683]">
                  Shipping
                </span>

                <span className="font-medium text-[#191C1D]">
                  {shipping === 0
                    ? 'Free'
                    : `₹${shipping}`}
                </span>
              </div>
            </div>

            {/* TOTAL */}
            <div
              className="
                mt-8
                pt-8
                border-t border-[#ECECEC]
                flex items-center justify-between
              "
            >
              <span
                className="
                  text-xl
                  font-semibold
                  text-[#191C1D]
                "
              >
                Total
              </span>

              <span
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-[#191C1D]
                "
              >
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={handleCheckout}
              className="
                w-full
                mt-10
                h-14
                rounded-[16px]
                bg-[#191C1D]
                text-white
                text-sm
                font-medium
                hover:bg-black
                transition-all
              "
            >
              Proceed to Checkout
            </button>

            {/* CONTINUE SHOPPING */}
            <Link
              to="/products"
              className="
                block
                text-center
                mt-6
                text-sm
                text-[#777683]
                hover:text-black
                transition-all
              "
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;