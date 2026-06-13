// frontend/src/App.jsx

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import { loadWishlist, resetWishlist } from './features/wishlist/wishlistSlice';


import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import ChatWidget from './components/ChatWidget';            // ← new


// Public
import HomePage          from './pages/HomePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import ProductListPage   from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import NotFoundPage      from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import EditorialPage from './pages/EditorialPage';

// Protected
import DashboardPage      from './pages/DashboardPage';
import CheckoutPage       from './pages/CheckoutPage';
import OrderHistoryPage   from './pages/OrderHistoryPage';
import OrderDetailPage    from './pages/OrderDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';



// Admin
import AdminLayout        from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage    from './pages/admin/AdminOrdersPage';
import AdminProductsPage  from './pages/admin/AdminProductsPage';
import AdminUsersPage     from './pages/admin/AdminUsersPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const { loading, token } = useSelector((s) => s.auth);

  // On first mount, restore the session from the localStorage token.
  useEffect(() => {
    if (token) dispatch(loadUser());
    if (isAuthenticated) dispatch(loadWishlist());
  else                 dispatch(resetWishlist());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, dispatch]); // run once

  // Show a spinner while the session is being restored.
  if (loading) return <Loader />;

  return (
    <>
      <Routes>
        {/* Every route shares the Layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/"             element={<HomePage />} />
          <Route path="/products"     element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"         element={<CartPage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path='/about' element={<AboutPage />} />

          {/* ── Protected — must be logged in ──────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"            element={<DashboardPage />} />
            <Route path="/checkout"             element={<CheckoutPage />} />
            <Route path="/orders"               element={<OrderHistoryPage />} />
            <Route path="/orders/:id"           element={<OrderDetailPage />} />
            <Route path="/payment/success/:id"  element={<PaymentSuccessPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path='/wishlist' element={<WishlistPage />} />
            <Route path='/editorial' element={<EditorialPage />} />


          </Route>

          {/* ── Admin-only ─────────────────────────────────── */}
         {/* ── Admin-only ─────────────────────────────────── */}
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index            element={<AdminDashboardPage />} />
    <Route path="orders"    element={<AdminOrdersPage />} />
    <Route path="products"  element={<AdminProductsPage />} />
    <Route path="products/new"      element={<AdminProductCreatePage />} /> 
    <Route path="products/:id/edit" element={<AdminProductCreatePage />} /> 
    <Route path="users"     element={<AdminUsersPage />} />
  </Route>
</Route>

          {/* ── 404 — must be LAST ─────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Floats over every page, including login/admin/404 */}
      <ChatWidget />
    </>
  );
};

export default App;