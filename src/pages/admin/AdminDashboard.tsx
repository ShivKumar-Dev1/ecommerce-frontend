import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/productSlice';
import { fetchMyOrders } from '../../store/orderSlice';
import { getAllUsersApi } from '../../api/adminApi';
import { useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { totalElements: totalProducts } = useAppSelector((state) => state.product);
  const { orders } = useAppSelector((state) => state.order);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 1 }));
    dispatch(fetchMyOrders({ page: 0, size: 100 })).then((res: any) => {
      if (fetchMyOrders.fulfilled.match(res)) {
        setTotalOrders(res.payload.totalElements);
      }
    });
    getAllUsersApi().then((res) => {
      setTotalUsers(res.data.data.length);
    });
  }, [dispatch]);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: <Package size={24} />,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag size={24} />,
      color: 'bg-indigo-500',
      link: '/admin/orders',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <Users size={24} />,
      color: 'bg-purple-500',
      link: '/admin/users',
    },
    {
      label: 'Delivered Orders',
      value: deliveredOrders,
      icon: <TrendingUp size={24} />,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.label}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group"
          >
            <div className={`${stat.color} text-white p-3 rounded-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-lg">Manage Products</h3>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 transition" />
          </div>
          <p className="text-gray-500 text-sm">Add, edit or delete products from your store</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-lg">Manage Orders</h3>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 transition" />
          </div>
          <p className="text-gray-500 text-sm">
            View and update order statuses
            {pendingOrders > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {pendingOrders} pending
              </span>
            )}
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-lg">Manage Users</h3>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 transition" />
          </div>
          <p className="text-gray-500 text-sm">View all registered users and their roles</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;