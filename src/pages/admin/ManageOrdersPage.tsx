import { useEffect, useState } from 'react';
import { getAllOrdersAdminApi, updateOrderStatusApi } from '../../api/orderApi';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED:   'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const ManageOrdersPage = () => {
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
      const data = res.data.data;
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.pageNumber);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, [page]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    setUpdatingId(orderId);
    try { await updateOrderStatusApi(orderId, status); toast.success(`Status updated to ${status}`); loadOrders(); }
    catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const toggleExpand = (id: number) => setExpandedId(expandedId === id ? null : id);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-48 rounded-lg mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 mb-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="skeleton h-5 w-36 rounded" />
                <div className="skeleton h-4 w-52 rounded" />
              </div>
              <div className="skeleton h-8 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-indigo-100"><ShoppingBag size={24} className="text-indigo-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm">View and update all customer orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-gray-900">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${STATUS_COLORS[order.status as OrderStatus]}`}>{order.status}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Customer: <span className="font-semibold text-gray-700">{order.userName}</span>
                  <span className="mx-2">·</span>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-indigo-600">₹{order.totalPrice.toLocaleString()}</span>
                <select
                  title="Update order status"
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50 font-medium"
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => toggleExpand(order.id)} title={expandedId === order.id ? 'Hide items' : 'View items'} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/50 animate-slide-up">
                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Items</h4>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3">
                      <img src={item.productImage || 'https://placehold.co/60x60/e2e8f0/64748b?text=N'} alt={item.productName} className="w-12 h-12 rounded-xl object-cover bg-gray-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-indigo-600">₹{item.subtotal.toLocaleString()}</p>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-gray-600 font-semibold">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
