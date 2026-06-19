import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { ShoppingCart, Package, LogOut, LayoutDashboard, User } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, role, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cart?.totalItems ?? 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/products" className="text-2xl font-bold text-indigo-600 tracking-tight">
          🛒 ShopEase
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-gray-600 hover:text-indigo-600 font-medium transition"
          >
            Products
          </Link>

          {isLoggedIn && role === 'USER' && (
            <>
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-indigo-600 transition"
              >
                <ShoppingCart size={22} />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>
              <Link
                to="/orders"
                className="text-gray-600 hover:text-indigo-600 transition"
                title="My Orders"
              >
                <Package size={22} />
              </Link>
            </>
          )}

          {isLoggedIn && role === 'ADMIN' && (
            <Link
              to="/admin"
              className="text-gray-600 hover:text-indigo-600 transition flex items-center gap-1"
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <User size={16} />
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;