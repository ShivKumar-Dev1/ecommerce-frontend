import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearAuthError } from '../../store/authSlice';
import { Store } from 'lucide-react';
import type { LoginRequest } from '../../types';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearAuthError()); }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginRequest) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate(result.payload.role === 'ADMIN' ? '/admin' : '/products');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <Store size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your ShopEase account</p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50/50`}
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3.5 rounded-xl border ${errors.password ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50/50`}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
