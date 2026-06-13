import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const AdminRoute = () => {
  const { isAuthenticated, loading, user, token } = useSelector(
    (state) => state.auth
  );

  // Token exists in localStorage but user hasn't been loaded yet
  // (e.g. hard navigation to /admin on a fresh page load).
  // Wait for loadUser to finish before deciding.
  if (loading || (token && !user)) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;