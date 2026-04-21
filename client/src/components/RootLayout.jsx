import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from '../store/slices/authSlice'

// RootLayout runs once on app mount.
// It re-hydrates auth state from the token stored in localStorage
// so the user stays logged in after a page refresh.

export default function RootLayout() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    // If there's a token, verify it with the server and get the user object
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, []) // Run once on mount only

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}