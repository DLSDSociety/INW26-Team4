import { useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import {
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import {
  loadOrderById,
} from '../features/orders/orderSlice';

const OrderDetailsPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  // FIXED REDUX SELECTOR
  const {
    current,
    loading,
    error,
  } = useSelector((state) => state.orders);

  // FINAL ORDER OBJECT
  const order = current;

  useEffect(() => {
    dispatch(loadOrderById(id));
  }, [dispatch, id]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#777683] text-sm tracking-wide">
          Loading order...
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

  // EMPTY STATE
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#777683] text-sm">
          Order not found.
        </p>
      </div>
    );
  }

  const subtotal = order.itemsPrice || 0;

  const shipping = order.shippingPrice || 0;

  const total = order.totalPrice || 0;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      <div
        className="
          max-w-[1440px]
          mx-auto
          px-4 md:px-8 xl:px-16
          py-10
        "
      >
        {/* HEADER */}
        <div
          className="
            flex flex-col md:flex-row
            md:items-center
            md:justify-between
            gap-6
          "
        >
          <div>

            {/* BACK BUTTON */}
            <Link
              to="/orders"
              className="
                inline-flex items-center gap-2
                text-sm font-medium
                text-[#666]
                hover:text-black
                transition-all
              "
            >
              <ChevronLeft size={16} />
              Back to my orders
            </Link>

            {/* LABEL */}
            <p
              className="
                mt-8
                text-[11px]
                uppercase
                tracking-[0.18em]
                font-semibold
                text-[#8A8A8A]
              "
            >
              Order Overview
            </p>

            {/* TITLE */}
            <h1
              className="
                mt-3
                text-4xl md:text-5xl
                font-semibold
                tracking-[-0.04em]
                text-[#191C1D]
              "
            >
              Order Details
            </h1>

            {/* ORDER ID */}
            <p
              className="
                mt-4
                text-sm
                text-[#777683]
              "
            >
              Order ID · {order._id}
            </p>
          </div>

          {/* STATUS BADGE */}
          <div
            className={`
              self-start
              rounded-full
              px-5 py-3
              text-sm
              font-medium
              border
              ${
                order.isPaid
                  ? 'bg-[#F4F7F2] border-[#DCE8D7] text-[#2F5E2E]'
                  : 'bg-[#FFF7ED] border-[#F6D9B8] text-[#9A5B13]'
              }
            `}
          >
            {order.isPaid
              ? 'Payment Successful'
              : 'Awaiting Payment'}
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          className="
            grid grid-cols-1 lg:grid-cols-12
            gap-10
            mt-14
          "
        >
          {/* LEFT SIDE */}
          <div className="lg:col-span-8 space-y-8">

            {/* ORDER ITEMS */}
            <section
              className="
                rounded-[20px]
                border border-[#E8E8E8]
                bg-white
                p-8
              "
            >
              <div className="flex items-center gap-3 mb-8">

                <Package size={20} />

                <h2
                  className="
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-[#191C1D]
                  "
                >
                  Order Items
                </h2>
              </div>

              <div className="space-y-6">

                {order.orderItems?.map((item) => (
                  <div
                    key={item.product}
                    className="
                      flex flex-col md:flex-row
                      md:items-center
                      gap-5
                      rounded-[16px]
                      bg-[#F8F9FA]
                      p-5
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        w-24 h-24
                        rounded-[12px]
                        overflow-hidden
                        bg-white
                        shrink-0
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1">

                      <h3
                        className="
                          text-lg
                          font-medium
                          text-[#191C1D]
                        "
                      >
                        {item.name}
                      </h3>

                      <div
                        className="
                          flex items-center gap-3
                          mt-3
                          text-sm
                          text-[#777683]
                        "
                      >
                        <span>
                          Qty: {item.qty}
                        </span>

                        <span>×</span>

                        <span>
                          ₹{item.price}
                        </span>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div
                      className="
                        text-2xl
                        font-semibold
                        tracking-[-0.03em]
                        text-[#191C1D]
                      "
                    >
                      ₹{item.qty * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SHIPPING */}
            <section
              className="
                rounded-[20px]
                border border-[#E8E8E8]
                bg-white
                p-8
              "
            >
              <div className="flex items-center gap-3 mb-8">

                <MapPin size={20} />

                <h2
                  className="
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-[#191C1D]
                  "
                >
                  Shipping Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">

                <div>
                  <p className="text-sm text-[#777683] mb-2">
                    Recipient
                  </p>

                  <p className="font-medium text-[#191C1D]">
                    {order.shippingAddress?.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#777683] mb-2">
                    Phone
                  </p>

                  <p className="font-medium text-[#191C1D]">
                    {order.shippingAddress?.phone}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-[#777683] mb-2">
                    Delivery Address
                  </p>

                  <p className="text-[#191C1D] leading-7">
                    {order.shippingAddress?.address},
                    {' '}
                    {order.shippingAddress?.city},
                    {' '}
                    {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>
            </section>

            {/* TIMELINE */}
            <section
              className="
                rounded-[20px]
                border border-[#E8E8E8]
                bg-white
                p-8
              "
            >
              <div className="flex items-center gap-3 mb-8">

                <Truck size={20} />

                <h2
                  className="
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-[#191C1D]
                  "
                >
                  Order Timeline
                </h2>
              </div>

              <div className="space-y-8">

                {/* ORDERED */}
                <div className="flex gap-4">

                  <div
                    className="
                      w-3 h-3
                      rounded-full
                      bg-black
                      mt-2
                    "
                  />

                  <div>
                    <p className="font-medium text-[#191C1D]">
                      Order Placed
                    </p>

                    <p className="text-sm text-[#777683] mt-1">
                      {order.createdAt?.substring(0, 10)}
                    </p>
                  </div>
                </div>

                {/* PAID */}
                {order.isPaid && (
                  <div className="flex gap-4">

                    <div
                      className="
                        w-3 h-3
                        rounded-full
                        bg-green-600
                        mt-2
                      "
                    />

                    <div>
                      <p className="font-medium text-[#191C1D]">
                        Payment Confirmed
                      </p>

                      <p className="text-sm text-[#777683] mt-1">
                        {order.paidAt?.substring(0, 10)}
                      </p>
                    </div>
                  </div>
                )}

                {/* DELIVERED */}
                {order.isDelivered && (
                  <div className="flex gap-4">

                    <div
                      className="
                        w-3 h-3
                        rounded-full
                        bg-blue-600
                        mt-2
                      "
                    />

                    <div>
                      <p className="font-medium text-[#191C1D]">
                        Delivered
                      </p>

                      <p className="text-sm text-[#777683] mt-1">
                        {order.deliveredAt?.substring(0, 10)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4">

            <div className="sticky top-28 space-y-6">

              {/* PAYMENT SUMMARY */}
              <section
                className="
                  rounded-[20px]
                  border border-[#E8E8E8]
                  bg-white
                  p-8
                "
              >
                <div className="flex items-center gap-3 mb-8">

                  <CreditCard size={20} />

                  <h2
                    className="
                      text-2xl
                      font-semibold
                      tracking-[-0.03em]
                      text-[#191C1D]
                    "
                  >
                    Payment Summary
                  </h2>
                </div>

                <div className="space-y-5">

                  <div className="flex justify-between text-[#464652]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#464652]">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-5">

                    <div className="flex justify-between items-center">

                      <span
                        className="
                          text-lg
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
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* PAYMENT STATUS */}
              <section
                className="
                  rounded-[20px]
                  border border-[#E8E8E8]
                  bg-white
                  p-8
                "
              >
                <div className="flex items-center gap-3 mb-6">

                  <ShieldCheck size={20} />

                  <h2
                    className="
                      text-xl
                      font-semibold
                      text-[#191C1D]
                    "
                  >
                    Payment Status
                  </h2>
                </div>

                <div
                  className={`
                    inline-flex
                    rounded-full
                    px-4 py-2
                    text-sm
                    font-medium
                    border
                    ${
                      order.isPaid
                        ? 'bg-[#F4F7F2] border-[#DCE8D7] text-[#2F5E2E]'
                        : 'bg-[#FFF7ED] border-[#F6D9B8] text-[#9A5B13]'
                    }
                  `}
                >
                  {order.isPaid
                    ? 'Payment Successful'
                    : 'Awaiting Payment'}
                </div>

                {order.paymentResult?.id && (
                  <p
                    className="
                      mt-5
                      text-sm
                      leading-6
                      text-[#777683]
                    "
                  >
                    Transaction ID:
                    {' '}
                    {order.paymentResult.id}
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;