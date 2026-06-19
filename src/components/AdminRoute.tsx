import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

const AdminRoute = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
  const user = useSelector((state: RootState) => state.auth.user)

  if (!isLoggedIn) return <Navigate to="/login" />
  if (user?.role !== 'ADMIN') return <Navigate to="/products" />

  return <Outlet />
}

export default AdminRoute