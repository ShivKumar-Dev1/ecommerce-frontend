import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/productSlice';
import { getAllOrdersAdminApi } from '../../api/orderApi';
import { getAllUsersApi } from '../../api/adminApi';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { totalElements: totalProducts } = useAppSelector((state) => state.product);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 1 }));
    getAllOrdersAdminApi({ page: 0, size: 100 }).then((res) => {
      const data = res.data.data;
      setTotalOrders(data.totalElements);
      setAllOrders(data.content);
    });
    getAllUsersApi().then((res) => setTotalUsers(res.data.data.length));
  }, [dispatch]);

  const pendingOrders = allOrders.filter((o: any) => o.status === 'PENDING').length;
  const deliveredOrders = allOrders.filter((o: any) => o.status === 'DELIVERED').length;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'from-blue-500 to-blue-600', link: '/admin/products' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'from-indigo-500 to-indigo-600', link: '/admin/orders' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'from-purple-500 to-purple-600', link: '/admin/users' },
    { label: 'Delivered Orders', value: deliveredOrders, icon: TrendingUp, color: 'from-green-500 to-emerald-600', link: '/admin/orders' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-100">
          <LayoutDashboard size={24} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's your store overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4">
            <div className={`bg-gradient-to-br ${stat.color} text-white p-3.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { to: '/admin/products', title: 'Manage Products', desc: 'Add, edit or delete products from your store', color: 'border-l-blue-500' },
          { to: '/admin/orders', title: 'Manage Orders', desc: 'View and update order statuses', badge: pendingOrders > 0 ? `${pendingOrders} pending` : null, color: 'border-l-indigo-500' },
          { to: '/admin/users', title: 'Manage Users', desc: 'View all registered users and their roles', color: 'border-l-purple-500' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className={`group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border-l-4 ${item.color}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {item.desc}
              {item.badge && <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{item.badge}</span>}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
