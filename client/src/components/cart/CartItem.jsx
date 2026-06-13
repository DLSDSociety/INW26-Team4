import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import {
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

import {
  updateQuantity,
  removeItem,
} from '../../features/cart/cartSlice';

const PLACEHOLDER =
  'https://via.placeholder.com/120?text=No+Image';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // SAFE VALUES
  const qty = Number(item.qty) || 1;

  const price = Number(item.price) || 0;

  const total = qty * price;

  // UPDATE QTY
  const setQty = (newQty) => {
    dispatch(
      updateQuantity({
        product: item.product,
        qty: newQty,
      })
    );
  };

  // REMOVE
  const removeHandler = () => {
    dispatch(removeItem(item.product));
  };

  return (
    <div className="p-8">

      <div
        className="
          flex flex-col
          md:flex-row
          gap-6
        "
      >
        {/* IMAGE */}
        <Link
          to={`/product/${item.product}`}
          className="
            w-full md:w-[140px]
            aspect-square
            rounded-[18px]
            overflow-hidden
            bg-[#F8F8F8]
            shrink-0
          "
        >
          <img
            src={item.image || PLACEHOLDER}
            alt={item.name}
            className="
              w-full
              h-full
              object-cover
            "
          />
        </Link>

        {/* CONTENT */}
        <div className="flex-1">

          <div
            className="
              flex flex-col
              lg:flex-row
              lg:items-start
              lg:justify-between
              gap-6
            "
          >
            {/* LEFT */}
            <div>

              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#9CA3AF]
                  mb-3
                "
              >
                Curated Collection
              </p>

              <Link
                to={`/product/${item.product}`}
                className="
                  text-2xl
                  font-semibold
                  text-[#191C1D]
                  hover:text-black
                  transition-all
                "
              >
                {item.name}
              </Link>

              <p
                className="
                  mt-4
                  text-2xl
                  font-semibold
                  text-[#191C1D]
                "
              >
                ₹{price.toLocaleString('en-IN')}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">

              <p
                className="
                  text-sm
                  text-[#777683]
                  mb-2
                "
              >
                Total
              </p>

              <h3
                className="
                  text-2xl
                  font-semibold
                  text-[#191C1D]
                "
              >
                ₹{total.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="
              mt-8
              flex items-center
              justify-between
            "
          >
            {/* QUANTITY */}
            <div
              className="
                flex items-center
                border border-[#E5E5E5]
                rounded-[14px]
                overflow-hidden
              "
            >
              {/* MINUS */}
              <button
                onClick={() =>
                  setQty(
                    Math.max(1, qty - 1)
                  )
                }
                className="
                  w-12 h-12
                  flex items-center justify-center
                  hover:bg-[#F5F5F5]
                  transition-all
                "
              >
                <Minus size={16} />
              </button>

              {/* VALUE */}
              <span
                className="
                  w-14 h-12
                  flex items-center justify-center
                  text-sm font-medium
                "
              >
                {qty}
              </span>

              {/* PLUS */}
              <button
                onClick={() =>
                  setQty(qty + 1)
                }
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

            {/* REMOVE */}
            <button
              onClick={removeHandler}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-red-500
                hover:text-red-600
                transition-all
              "
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;