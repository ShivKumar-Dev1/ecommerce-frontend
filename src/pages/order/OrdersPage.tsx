import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyOrders, cancelOrder } from '../../store/orderSlice';
import { toast } from 'react-toastify';
import { Package, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, totalPages, currentPage } = useAppSelector((state) => state.order);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyOrders({ page, size: 5 }));
  }, [page, dispatch]);

  const handleCancel = async (id: number) => {
    const result = await dispatch(cancelOrder(id));
    if (cancelOrder.fulfilled.match(result)) {
      toast.success('Order cancelled');
    } else {
      toast.error('Cannot cancel this order');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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

  // Empty
  if (!loading && orders.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-4">📦</p>
        <h3 className="text-2xl font-bold text-gray-700">No orders yet</h3>
        <p className="text-gray-500 mt-2">Place your first order from the cart</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Package size={26} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Order Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-indigo-600 text-lg">
                  ₹{order.totalPrice.toLocaleString()}
                </span>

                {/* Cancel Button */}
                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <X size={14} /> Cancel
                  </button>
                )}

                {/* Expand Toggle */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="text-gray-400 hover:text-indigo-600 transition"
                  title="View items"
                >
                  {expandedId === order.id
                    ? <ChevronUp size={20} />
                    : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Order Items — expandable */}
            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.productImage || 'https://placehold.co/60x60?text=No+Image'}
                        alt={item.productName}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-indigo-600">
                          ₹{item.subtotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-indigo-600 text-lg">
                    ₹{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;