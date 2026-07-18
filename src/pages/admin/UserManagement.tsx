import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  UserMinus, 
  Mail, 
  Download, 
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { User, UserRole } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'verified' ? user.isVerified : !user.isVerified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (userId: string, action: string) => {
    console.log(`Action ${action} on user ${userId}`);
    // Implement CRUD actions here
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">User Management</h1>
          <p className="text-gray-500 font-medium">Manage all platform users including Farmers, Buyers, and Experts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers</option>
            <option value="expert">Experts</option>
            <option value="admin">Admins</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role & Access</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Join Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="h-12 bg-gray-100 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center font-black overflow-hidden border border-gray-200 group-hover:scale-105 transition-transform shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{user.name}</p>
                          <p className="text-xs font-bold text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        user.role === 'admin' ? "bg-red-50 text-red-600" :
                        user.role === 'farmer' ? "bg-green-50 text-green-600" :
                        user.role === 'buyer' ? "bg-blue-50 text-blue-600" :
                        "bg-purple-50 text-purple-600"
                      )}>
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                        user.isVerified ? "text-green-600" : "text-orange-500"
                      )}>
                        {user.isVerified ? (
                          <><CheckCircle2 className="w-4 h-4" /> Verified</>
                        ) : (
                          <><AlertCircle className="w-4 h-4" /> Pending</>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-green-600 hover:shadow-lg transition-all" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all" title="Edit User">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-red-600 hover:shadow-lg transition-all" title="Suspend User">
                          <UserMinus className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-red-700 hover:shadow-lg transition-all" title="Delete Permanent">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No users found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-gray-900">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                    currentPage === i + 1 ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "hover:bg-gray-50 text-gray-500"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
