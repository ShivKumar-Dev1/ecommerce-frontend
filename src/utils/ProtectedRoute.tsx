import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { isLoggedIn, role } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== 'ADMIN') {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;