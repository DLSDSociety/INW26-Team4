import { useEffect, useMemo, useState } from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from '../features/cart/cartSlice';

import {
  placeOrder,
} from '../features/orders/orderSlice';

import {
  loadAddresses,
  selectAddresses,
  selectDefaultAddress,
} from '../features/user/userSlice';

import usePayment from '../features/payment/usePayment';

const CheckoutPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // CART
  const items = useSelector(selectCartItems);

  const subtotal = useSelector(
    selectCartSubtotal
  );

  // AUTH
  const { user } = useSelector(
    (state) => state.auth
  );

  // ADDRESS BOOK
  const addresses = useSelector(
    selectAddresses
  );

  const defaultAddress = useSelector(
    selectDefaultAddress
  );

  // ORDERS
  const { loading, error } = useSelector(
    (state) => state.orders
  );

  // PAYMENT
  const {
    pay,
    paying,
    error: payError,
  } = usePayment();

  // ─────────────────────────────────────────────────
  // FORM STATE
  //
  // Pattern: derive the displayed address during render
  // instead of syncing via useEffect. We only store the
  // user's explicit choices:
  //
  //   pickedId  — null  => no explicit pick yet
  //                       (falls back to defaultAddress)
  //              ''    => user picked "new address"
  //              id    => user picked a saved address
  //
  //   formOverrides — per-field manual edits made by
  //                   the user; takes precedence over
  //                   the picked address values.
  // ─────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] =
    useState('Razorpay');

  const [pickedId, setPickedId] =
    useState(null);

  const [formOverrides, setFormOverrides] =
    useState({});

  // LOAD ADDRESS BOOK ON MOUNT
  // (this is a valid effect — external sync, no setState)
  useEffect(() => {
    dispatch(loadAddresses());
  }, [dispatch]);

  // EFFECTIVE PICK
  // If the user hasn't explicitly picked anything (null),
  // fall back to the default address. Explicit '' means
  // "new address" and is preserved.
  const effectiveId =
    pickedId !== null
      ? pickedId
      : defaultAddress?._id || '';

  // SOURCE ADDRESS (from the address book)
  const sourceAddress = effectiveId
    ? addresses.find(
        (a) => a._id === effectiveId
      )
    : null;

  // DISPLAYED ADDRESS
  // Per-field merge: formOverrides win, then the
  // sourceAddress fields, then sensible empty defaults.
  const address = {
    fullName:
      formOverrides.fullName ??
      sourceAddress?.fullName ??
      user?.name ??
      '',

    address:
      formOverrides.address ??
      sourceAddress?.address ??
      '',

    city:
      formOverrides.city ??
      sourceAddress?.city ??
      '',

    postalCode:
      formOverrides.postalCode ??
      sourceAddress?.postalCode ??
      '',

    phone:
      formOverrides.phone ??
      sourceAddress?.phone ??
      '',
  };

  // SHIPPING
  const shipping =
    subtotal > 1000 || subtotal === 0
      ? 0
      : 50;

  // TOTAL
  const total = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);

  // INPUT CHANGE
  // Editing a field updates the override map and
  // clears the saved-address selection (the form is
  // now diverged from any saved address).
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormOverrides((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (effectiveId !== '') {
      setPickedId('');
    }
  };

  // PICK A SAVED ADDRESS
  const handlePickAddress = (id) => {
    setPickedId(id);

    // Clear edits so the picked address values show
    // through cleanly.
    setFormOverrides({});
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      items: items.map((item) => ({
        product: item.product,

        quantity:
          Number(item.qty) || 1,
      })),

      shippingAddress: address,

      paymentMethod,
    };

    // CREATE ORDER
    const result = await dispatch(
      placeOrder(orderData)
    );

    if (
      !placeOrder.fulfilled.match(result)
    ) {
      return;
    }

    const newOrderId =
      result.payload._id;

    dispatch(clearCart());

    // COD
    if (paymentMethod === 'COD') {
      navigate(
        `/orders/${newOrderId}`,
        {
          replace: true,
        }
      );
    }

    // ONLINE
    else {
      pay(newOrderId, {
        onSuccess: () =>
          navigate(
            `/payment/success/${newOrderId}`,
            {
              replace: true,
            }
          ),

        onDismiss: () =>
          navigate(
            `/orders/${newOrderId}`,
            {
              replace: true,
            }
          ),
      });
    }
  };

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen flex items-center justify-center">

        <div className="text-center">
          <h2
            className="
              text-3xl
              font-semibold
              tracking-[-0.03em]
              text-[#191C1D]
            "
          >
            Your cart is empty
          </h2>

          <p className="mt-4 text-[#777683]">
            Add products before checkout.
          </p>
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
            Secure Checkout
          </p>

          <h1
            className="
              text-4xl md:text-5xl
              font-semibold
              tracking-[-0.04em]
              text-[#191C1D]
            "
          >
            Checkout
          </h1>
        </div>

        {/* ERRORS */}
        {(error || payError) && (
          <div
            className="
              mb-8
              rounded-[16px]
              border border-red-200
              bg-red-50
              px-5 py-4
              text-sm text-red-600
            "
          >
            {error || payError}
          </div>
        )}

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
          <form
            onSubmit={handleSubmit}
            className="
              bg-white
              rounded-[28px]
              border border-[#ECECEC]
              p-8 md:p-10
            "
          >
            {/* SHIPPING */}
            <div>

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
                Shipping Information
              </p>

              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-[#191C1D]
                "
              >
                Delivery Address
              </h2>
            </div>

            {/* SAVED ADDRESSES PICKER */}
            {addresses.length > 0 && (
              <div className="mt-10">

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
                  Saved Addresses
                </p>

                <div className="grid sm:grid-cols-2 gap-4">

                  {addresses.map((a) => {
                    const isActive =
                      effectiveId ===
                      a._id;

                    return (
                      <button
                        key={a._id}
                        type="button"
                        onClick={() =>
                          handlePickAddress(
                            a._id
                          )
                        }
                        className={`
                          text-left
                          rounded-[18px]
                          border
                          p-5
                          transition-all
                          ${
                            isActive
                              ? 'border-black bg-[#FAFAFA]'
                              : 'border-[#ECECEC] hover:border-[#191C1D]'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">

                          <p className="font-medium text-[#191C1D]">
                            {a.label}
                          </p>

                          {a.isDefault && (
                            <span
                              className="
                                text-[10px]
                                uppercase
                                tracking-[0.12em]
                                font-semibold
                                text-[#15157d]
                                bg-[#EEF0FF]
                                rounded-full
                                px-2 py-0.5
                              "
                            >
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[#191C1D]">
                          {a.fullName}
                        </p>

                        <p className="text-sm text-[#777683] mt-1">
                          {a.address},{' '}
                          {a.city}
                          {a.state
                            ? `, ${a.state}`
                            : ''}{' '}
                          — {a.postalCode}
                        </p>

                        <p className="text-sm text-[#777683] mt-1">
                          {a.phone}
                        </p>
                      </button>
                    );
                  })}

                  {/* NEW ADDRESS OPTION */}
                  <button
                    type="button"
                    onClick={() =>
                      handlePickAddress('')
                    }
                    className={`
                      text-left
                      rounded-[18px]
                      border border-dashed
                      p-5
                      transition-all
                      flex items-center justify-center
                      min-h-[120px]
                      ${
                        effectiveId === ''
                          ? 'border-black bg-[#FAFAFA] text-[#191C1D]'
                          : 'border-[#D4D4D4] text-[#777683] hover:border-[#191C1D] hover:text-[#191C1D]'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">
                      + Enter a new address
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* INPUTS */}
            <div className="mt-10 space-y-8">

              {/* FULL NAME */}
              <div>
                <label className="checkout-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="checkout-label">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                />
              </div>

              {/* CITY + POSTAL */}
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="checkout-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                  />
                </div>

                <div>
                  <label className="checkout-label">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="checkout-label">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div
              className="
                mt-16
                pt-12
                border-t border-[#ECECEC]
              "
            >
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
                Payment
              </p>

              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-[#191C1D]
                "
              >
                Payment Method
              </h2>

              {/* METHODS */}
              <div className="mt-10 space-y-4">

                {/* ONLINE */}
                <label
                  className={`
                    flex items-center gap-4
                    rounded-[18px]
                    border
                    p-5
                    cursor-pointer
                    transition-all
                    ${
                      paymentMethod ===
                      'Razorpay'
                        ? 'border-black bg-[#FAFAFA]'
                        : 'border-[#ECECEC]'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={
                      paymentMethod ===
                      'Razorpay'
                    }
                    onChange={() =>
                      setPaymentMethod(
                        'Razorpay'
                      )
                    }
                  />

                  <div>
                    <p className="font-medium text-[#191C1D]">
                      Pay Online
                    </p>

                    <p className="text-sm text-[#777683] mt-1">
                      Razorpay — cards,
                      UPI, netbanking
                    </p>
                  </div>
                </label>

                {/* COD */}
                <label
                  className={`
                    flex items-center gap-4
                    rounded-[18px]
                    border
                    p-5
                    cursor-pointer
                    transition-all
                    ${
                      paymentMethod ===
                      'COD'
                        ? 'border-black bg-[#FAFAFA]'
                        : 'border-[#ECECEC]'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={
                      paymentMethod ===
                      'COD'
                    }
                    onChange={() =>
                      setPaymentMethod(
                        'COD'
                      )
                    }
                  />

                  <div>
                    <p className="font-medium text-[#191C1D]">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-[#777683] mt-1">
                      Pay once your order
                      arrives
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || paying}
              className="
                w-full
                mt-14
                h-14
                rounded-[16px]
                bg-[#191C1D]
                text-white
                text-sm
                font-medium
                hover:bg-black
                transition-all
                disabled:opacity-60
              "
            >
              {loading
                ? 'Placing order...'
                : paying
                ? 'Opening payment...'
                : paymentMethod === 'COD'
                ? 'Place Order'
                : 'Place Order & Pay'}
            </button>
          </form>

          {/* SUMMARY */}
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

            {/* ITEMS */}
            <div className="mt-10 space-y-6">

              {items.map((item) => {
                const qty =
                  Number(item.qty) || 1;

                const price =
                  Number(item.price) || 0;

                return (
                  <div
                    key={item.product}
                    className="
                      flex items-start justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p className="font-medium text-[#191C1D]">
                        {item.name}
                      </p>

                      <p className="text-sm text-[#777683] mt-1">
                        Quantity: {qty}
                      </p>
                    </div>

                    <p className="font-medium text-[#191C1D]">
                      ₹
                      {(
                        price * qty
                      ).toLocaleString(
                        'en-IN'
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* TOTALS */}
            <div
              className="
                mt-10
                pt-8
                border-t border-[#ECECEC]
                space-y-5
              "
            >
              <div className="flex justify-between">
                <span className="text-[#777683]">
                  Subtotal
                </span>

                <span className="font-medium text-[#191C1D]">
                  ₹
                  {subtotal.toLocaleString(
                    'en-IN'
                  )}
                </span>
              </div>

              <div className="flex justify-between">
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

            {/* FINAL */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;