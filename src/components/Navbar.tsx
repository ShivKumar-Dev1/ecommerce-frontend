import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { ShoppingCart, Package, LogOut, LayoutDashboard, User, Menu, X, Store } from 'lucide-react';
import { toast } from 'react-toastify';

const NAV_LINKS = [
  { to: '/products', label: 'Products', icon: Store },
] as const;

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, role, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cart?.totalItems ?? 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navContent = (
    <>
      {NAV_LINKS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
      {isLoggedIn && role === 'USER' && (
        <>
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="relative text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <ShoppingCart size={22} />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white animate-scale-in">
                {cartItems}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileOpen(false)}
            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            title="My Orders"
          >
            <Package size={22} />
          </Link>
        </>
      )}
      {isLoggedIn && role === 'ADMIN' && (
        <Link
          to="/admin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium"
        >
          <LayoutDashboard size={20} />
          <span>Admin</span>
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/products" className="flex items-center gap-2 text-xl font-bold text-indigo-600 tracking-tight shrink-0">
            <Store size={28} className="text-indigo-600" />
            ShopEase
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navContent}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="flex items-center gap-1.5 text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-full">
                  <User size={14} />
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 text-sm">Sign In</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md">Get Started</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            {isLoggedIn && role === 'USER' && (
              <>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
                  <ShoppingCart size={18} />
                  Cart {cartItems > 0 && <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{cartItems}</span>}
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
                  <Package size={18} />
                  My Orders
                </Link>
              </>
            )}
            {isLoggedIn && role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            )}
            <hr className="border-gray-100" />
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm">
                  <User size={16} />
                  {user?.name}
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all w-full">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center px-3 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
