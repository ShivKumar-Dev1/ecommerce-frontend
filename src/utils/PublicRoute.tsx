import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface Props {
  children: React.ReactNode;
}

// Prevents logged-in users from going back to login/register
const PublicRoute = ({ children }: Props) => {
  const { isLoggedIn, role } = useAppSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/products'} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;