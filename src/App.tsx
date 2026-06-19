import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Product Pages
import ProductListingPage from './pages/product/ProductListingPage';
import ProductDetailPage from './pages/product/ProductDetailPage';

// Cart & Order Pages
import CartPage from './pages/cart/CartPage';
import OrdersPage from './pages/order/OrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Public Routes — redirect to home if already logged in */}
            <Route path="/login" element={
              <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute><RegisterPage /></PublicRoute>
            } />

            {/* Public Product Routes */}
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Protected User Routes */}
            <Route path="/cart" element={
              <ProtectedRoute><CartPage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly><ManageProductsPage /></ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly><ManageOrdersPage /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly><ManageUsersPage /></ProtectedRoute>
            } />

            {/* 404 fallback */}
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-gray-300">404</h2>
                <p className="text-gray-500 mt-2">Page not found</p>
                <a href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
                  Go to Products
                </a>
              </div>
            } />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;