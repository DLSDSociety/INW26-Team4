import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

/**
 * ProtectedRoute — Task #6.
 *
 * Wraps any route that requires authentication.
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Still restoring the session from the token.
  if (loading) return <Loader />;

  // Not logged in — bounce to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the child route.
  return <Outlet />;
};

export default ProtectedRoute;
