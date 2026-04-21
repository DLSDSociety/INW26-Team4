import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated, selectIsAdmin, selectAuthLoading } from '../store/slices/authSlice'
import Spinner from './Spinner'

// AdminRoute first checks authentication, then checks if the user is an admin.
// - Not logged in  → redirect to /login
// - Logged in, not admin → redirect to / (or a 403 page)
// - Logged in, is admin  → render child routes via <Outlet />

export default function AdminRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const loading = useSelector(selectAuthLoading)

  if (loading) {
    return <Spinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    // User is logged in but not an admin — send them home
    return <Navigate to="/" replace />
  }

  return <Outlet />
}