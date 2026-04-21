import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'

// Pages
import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'

// Admin pages (placeholders — built in Week 8/9)
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,          // Navbar + Footer wrapper
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // Protected routes — must be logged in
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart', element: <CartPage /> },
        ],
      },

      // Admin routes — must be logged in AND role === 'admin'
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              // Add admin/products, admin/orders, admin/users in Week 8–9
            ],
          },
        ],
      },
    ],
  },
])