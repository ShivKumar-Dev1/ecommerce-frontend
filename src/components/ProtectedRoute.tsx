import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute