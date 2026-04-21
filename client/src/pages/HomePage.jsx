export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Store</h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Discover amazing products at great prices. Shop now and enjoy free shipping on all orders.
      </p>
      <a
        href="/products"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Shop Now
      </a>
    </div>
  )
}