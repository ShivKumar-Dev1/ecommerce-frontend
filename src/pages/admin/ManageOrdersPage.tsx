import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyOrders } from '../../store/orderSlice';
import { updateOrderStatusApi, getAllOrdersAdminApi } from '../../api/orderApi';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const ManageOrdersPage = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersAdminApi({ page, size: 8 });
      setOrders(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(res.data.data.pageNumber);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusApi(orderId, status);
      toast.success(`Order status updated to ${status}`);
      loadOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
        <p className="text-gray-500 text-sm mt-1">View and update all customer orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Order Row */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-gray-800">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status as OrderStatus]}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Customer: <span className="font-medium text-gray-700">{order.userName}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-indigo-600 text-lg">
                  ₹{order.totalPrice.toLocaleString()}
                </span>

                {/* Status Dropdown */}
                <select
                  title="Update order status"
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* Expand */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  title="Toggle order items"
                  className="text-gray-400 hover:text-indigo-600 transition"
                >
                  {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Expanded Items */}
            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.productImage || 'https://placehold.co/60x60?text=No'}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-indigo-600">
                        ₹{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-indigo-600">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

export default ManageOrdersPage;