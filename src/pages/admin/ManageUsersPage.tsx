import { useEffect, useState } from 'react';
import { getAllUsersApi } from '../../api/adminApi';
import { toast } from 'react-toastify';
import { Users, Shield, User, Search } from 'lucide-react';
import type { UserResponse } from '../../types';

const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try { const res = await getAllUsersApi(); setUsers(res.data.data); }
      catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    loadUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;
  const totalCustomers = users.filter((u) => u.role === 'USER').length;

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-48 rounded-lg mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (<div key={i} className="skeleton h-24 rounded-2xl" />))}
        </div>
        <div className="skeleton h-10 w-64 rounded-xl mb-4" />
        <div className="bg-white rounded-2xl overflow-hidden">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="skeleton h-16 border-b border-gray-100" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-purple-100"><Users size={24} className="text-purple-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm">All registered users on your platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Admins', value: totalAdmins, icon: Shield, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100' },
          { label: 'Customers', value: totalCustomers, icon: User, color: 'from-green-500 to-emerald-600', bg: 'bg-green-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className={`bg-gradient-to-br ${stat.color} text-white p-3.5 rounded-xl shadow-sm`}><stat.icon size={22} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
