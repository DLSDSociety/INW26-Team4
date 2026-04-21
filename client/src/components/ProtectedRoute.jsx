import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectAuthLoading } from '../store/slices/authSlice'
import Spinner from './Spinner'

// ProtectedRoute guards any route that requires the user to be logged in.
// If they're not authenticated, they're redirected to /login.
// We also pass `state.from` so after login, we can redirect them back
// to the page they were trying to visit.

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const location = useLocation()

  // While the app is verifying the stored token on mount, show a spinner
  // instead of incorrectly bouncing the user to /login
  if (loading) {
    return <Spinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}