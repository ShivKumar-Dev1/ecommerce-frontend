import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/orderSlice';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import type { OrderRequest } from '../../types';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const { placing } = useAppSelector((state) => state.order);

  const [showCheckout, setShowCheckout] = useState(false);

  const {
    register: registerOrder,
    handleSubmit: handleOrderSubmit,
    formState: { errors: orderErrors },
    reset: resetOrderForm,
  } = useForm<OrderRequest>();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handlePlaceOrder = async (data: OrderRequest) => {
    const result = await dispatch(placeOrder(data));
    if (placeOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully! 🎉');
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
  const result = await dispatch(updateCartItem({ itemId, productId, quantity: newQty }));
  if (updateCartItem.fulfilled.match(result)) {
    toast.success('Cart updated');
  } else {
    toast.error('Failed to update cart');
  }
};

  const handleRemove = async (itemId: number) => {
    const result = await dispatch(removeFromCart(itemId));
    if (removeFromCart.fulfilled.match(result)) {
      toast.success('Item removed');
    } else {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const result = await dispatch(clearCart());
    if (clearCart.fulfilled.match(result)) {
      toast.success('Cart cleared');
    } else {
      toast.error('Failed to clear cart');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  // Empty Cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-4">🛒</p>
        <h3 className="text-2xl font-bold text-gray-700">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Add some products to get started</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
         <button
  onClick={() => navigate('/products')}
  title="Back to Products"
  className="text-gray-500 hover:text-indigo-600 transition"
>
  <ArrowLeft size={22} />
</button>
          <h1 className="text-2xl font-bold text-gray-800">
            My Cart
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
       <button
  onClick={handleClearCart}
  title="Clear Cart"
  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
>
  <Trash2 size={16} /> Clear Cart
</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
            >
              {/* Product Image */}
              <img
                src={item.productImage || 'https://placehold.co/100x100?text=No+Image'}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.productName}</h3>
                <p className="text-indigo-600 font-bold mt-1">
                  ₹{item.productPrice.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Subtotal: ₹{item.subtotal.toLocaleString()}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
               <button
 onClick={() => handleQuantityChange(item.id, item.productId, item.quantity - 1)}
  disabled={item.quantity <= 1}
  title="Decrease quantity"
  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
>
  <Minus size={14} />
</button>
                <span className="w-8 text-center font-semibold text-gray-800">
                  {item.quantity}
                </span>
               <button
  onClick={() => handleQuantityChange(item.id, item.productId, item.quantity + 1)}
  title="Increase quantity"
  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition"
>
  <Plus size={14} />
</button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-400 hover:text-red-600 transition ml-2"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            {/* Item breakdown */}
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate flex-1 mr-2">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-gray-500 text-sm mb-2">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 mt-3">
                <span>Total</span>
                <span className="text-indigo-600">₹{cart.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition"
            >
              <ShoppingBag size={20} />
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-indigo-400 hover:text-indigo-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Delivery Details</h2>
            <p className="text-gray-500 text-sm mb-5">Enter your delivery information</p>

            <form onSubmit={handleOrderSubmit(handlePlaceOrder)} className="space-y-4">

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your full address"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    orderErrors.address ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none`}
                  {...registerOrder('address', { required: 'Address is required' })}
                />
                {orderErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{orderErrors.address.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Your city"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    orderErrors.city ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                  {...registerOrder('city', { required: 'City is required' })}
                />
                {orderErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{orderErrors.city.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    orderErrors.phone ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                  {...registerOrder('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit number',
                    },
                  })}
                />
                {orderErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{orderErrors.phone.message}</p>
                )}
              </div>

              {/* Order Total */}
              <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Order Total</span>
                <span className="text-indigo-600 font-bold text-lg">
                  ₹{cart?.totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-red-400 hover:text-red-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={placing}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {placing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Placing...
                    </span>
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