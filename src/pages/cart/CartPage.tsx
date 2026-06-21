import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/orderSlice';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin, Phone, Building2, Shield } from 'lucide-react';
import type { OrderRequest } from '../../types';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const { placing } = useAppSelector((state) => state.order);
  const [showCheckout, setShowCheckout] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { register: registerOrder, handleSubmit: handleOrderSubmit, formState: { errors: orderErrors }, reset: resetOrderForm } = useForm<OrderRequest>();

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handlePlaceOrder = async (data: OrderRequest) => {
    const result = await dispatch(placeOrder(data));
    if (placeOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      setShowCheckout(false);
      resetOrderForm();
      navigate('/orders');
    } else {
      toast.error('Failed to place order');
    }
  };

  const handleQuantityChange = async (itemId: number, productId: number, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    await dispatch(updateCartItem({ itemId, productId, quantity: newQty }));
    setUpdatingId(null);
  };

  const handleRemove = async (itemId: number) => {
    setUpdatingId(itemId);
    await dispatch(removeFromCart(itemId));
    setUpdatingId(null);
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    await dispatch(clearCart());
    toast.success('Cart cleared');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="skeleton h-8 w-48 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-4">
                <div className="skeleton w-20 h-20 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-4 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <p className="text-6xl mb-4">🛒</p>
        <h3 className="text-2xl font-bold text-gray-700">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet</p>
        <button onClick={() => navigate('/products')} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/products')} title="Back to products" className="text-gray-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
            <span className="ml-2 text-sm font-normal text-gray-500">({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>
        <button onClick={handleClearCart} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl">
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item, i) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex gap-4 items-center animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                <img src={item.productImage || 'https://placehold.co/200x200/e2e8f0/64748b?text=N'} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.productName}</h3>
                <p className="text-indigo-600 font-bold mt-0.5">₹{item.productPrice.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Subtotal: <span className="font-medium text-gray-600">₹{item.subtotal.toLocaleString()}</span></p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuantityChange(item.id, item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updatingId === item.id}
                  title="Decrease quantity"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="w-9 text-center font-bold text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.productId, item.quantity + 1)}
                  disabled={updatingId === item.id}
                  title="Increase quantity"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => handleRemove(item.id)} disabled={updatingId === item.id} title="Remove item" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40">
                {updatingId === item.id ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : <Trash2 size={18} />}
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate flex-1 mr-2">{item.productName} × {item.quantity}</span>
                  <span className="font-medium">₹{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{cart.totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span className="text-indigo-600">₹{cart.totalPrice.toLocaleString()}</span></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Shield size={14} /> Secure checkout
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
            >
              <ShoppingBag size={20} />
              Proceed to Checkout
            </button>
            <button onClick={() => navigate('/products')} className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all">Continue Shopping</button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Delivery Details</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in your shipping information</p>
            <form onSubmit={handleOrderSubmit(handlePlaceOrder)} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5"><MapPin size={16} /> Delivery Address</label>
                <textarea rows={3} placeholder="Enter your full address" className={`w-full px-4 py-3 rounded-xl border ${orderErrors.address ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none`} {...registerOrder('address', { required: 'Address is required' })} />
                {orderErrors.address && <p className="text-red-500 text-xs mt-1">{orderErrors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5"><Building2 size={16} /> City</label>
                  <input type="text" placeholder="Your city" className={`w-full px-4 py-3 rounded-xl border ${orderErrors.city ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all`} {...registerOrder('city', { required: 'City is required' })} />
                  {orderErrors.city && <p className="text-red-500 text-xs mt-1">{orderErrors.city.message}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5"><Phone size={16} /> Phone</label>
                  <input type="tel" placeholder="10-digit number" className={`w-full px-4 py-3 rounded-xl border ${orderErrors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all`} {...registerOrder('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' } })} />
                  {orderErrors.phone && <p className="text-red-500 text-xs mt-1">{orderErrors.phone.message}</p>}
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Order Total</span>
                <span className="text-indigo-600 font-bold text-xl">₹{cart?.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-red-300 hover:text-red-500 transition-all">Cancel</button>
                <button type="submit" disabled={placing} className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-md">
                  {placing ? (
                    <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Placing...</span>
                  ) : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
