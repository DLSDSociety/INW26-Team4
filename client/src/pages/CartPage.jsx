import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectCartItems,
  selectCartTotalQuantity,
  selectCartTotalPrice,
  removeItem,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice'

export default function CartPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const totalQuantity = useSelector(selectCartTotalQuantity)
  const totalPrice = useSelector(selectCartTotalPrice)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Shopping Cart{' '}
        <span className="text-base font-normal text-gray-500">
          ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
        </span>
      </h1>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg bg-gray-100"
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">{item.name}</h2>
              <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                }
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))
                }
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
              >
                +
              </button>
            </div>

            {/* Item Subtotal */}
            <p className="w-20 text-right font-semibold text-gray-700">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeItem(item._id))}
              className="text-red-400 hover:text-red-600 transition text-lg"
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal ({totalQuantity} items)</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-4">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => alert('Checkout coming in Week 7!')}
        >
          Proceed to Checkout
        </button>

        <button
          onClick={() => dispatch(clearCart())}
          className="mt-3 w-full text-red-500 hover:text-red-700 text-sm transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Also check out missing placeholder pages */}
      <p className="text-center text-xs text-gray-400 mt-6">
        ⚠️ Full cart features (checkout flow) will be built in Week 7.
      </p>
    </div>
  )
}