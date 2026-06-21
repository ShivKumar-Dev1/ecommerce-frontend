import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyOrders, cancelOrder } from '../../store/orderSlice';
import { toast } from 'react-toastify';
import { Package, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED:   'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_ICONS: Record<OrderStatus, string> = {
  PENDING: '⏳',
  CONFIRMED: '✅',
  SHIPPED: '🚚',
  DELIVERED: '📦',
  CANCELLED: '❌',
};

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, totalPages, currentPage } = useAppSelector((state) => state.order);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => { dispatch(fetchMyOrders({ page, size: 5 })); }, [page, dispatch]);

  const handleCancel = async (id: number) => {
    const result = await dispatch(cancelOrder(id));
    if (cancelOrder.fulfilled.match(result)) { toast.success('Order cancelled'); }
    else { toast.error('Cannot cancel this order'); }
  };

  const toggleExpand = (id: number) => setExpandedId(expandedId === id ? null : id);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-8 w-40 rounded-lg mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 mb-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="skeleton h-5 w-32 rounded" />
                <div className="skeleton h-4 w-48 rounded" />
              </div>
              <div className="skeleton h-8 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <p className="text-6xl mb-4">📦</p>
        <h3 className="text-2xl font-bold text-gray-700">No orders yet</h3>
        <p className="text-gray-500 mt-2">Place your first order from the cart</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-100">
          <Package size={24} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage your purchases</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${STATUS_COLORS[order.status]}`}>
                    {STATUS_ICONS[order.status]} {order.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl text-indigo-600">₹{order.totalPrice.toLocaleString()}</span>
                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <button onClick={() => handleCancel(order.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all">
                    <X size={14} /> Cancel
                  </button>
                )}
                <button onClick={() => toggleExpand(order.id)} title={expandedId === order.id ? 'Hide items' : 'View items'} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-5 sm:px-6 py-5 bg-gray-50/50 animate-slide-up">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3">
                      <img src={item.productImage || 'https://placehold.co/60x60/e2e8f0/64748b?text=N'} alt={item.productName} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">₹{item.subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-xl text-indigo-600">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            <ChevronLeft size={18} /> Previous
          </button>
          <span className="text-gray-600 font-semibold">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
