import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  X,
  PlusCircle,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { Expense } from '../../types';
import { cn } from '../../lib/utils';

export const ExpenseTrackerPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = [
    'Seeds', 'Fertilizers', 'Pesticides', 'Fuel', 'Labour', 
    'Machinery', 'Transport', 'Electricity', 'Water', 'Miscellaneous'
  ];

  const [formData, setFormData] = useState({
    category: 'Seeds',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: Number(formData.amount) })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchExpenses();
        setFormData({
          category: 'Seeds',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-red-700 uppercase tracking-[0.2em] mb-4 block">Expense Management</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Expense Tracker.</h1>
          <p className="text-xl text-gray-500 font-medium">Detailed auditing of your farm expenditures.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center gap-3 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex flex-col justify-between min-h-[180px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full">Audited</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Total Period Expenses</p>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">₹{totalFiltered.toLocaleString()}</h4>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8 overflow-hidden">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-black text-gray-900">Spending by Category</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 5).map(cat => (
                <span key={cat} className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {cat}
                </span>
              ))}
              <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">+5 More</span>
            </div>
          </div>
          <div className="hidden md:block w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search descriptions or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-8 py-5 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none pr-12 relative"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="px-8 py-5 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-10 py-8"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                </tr>
              ))
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold">No expenses found matching your criteria.</td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-bold text-gray-500 max-w-xs truncate">{expense.description}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="text-lg font-black text-gray-900">₹{(expense.amount || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-200 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Add Expense</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (INR)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      placeholder="e.g. Purchased 50kg Urea from Apex Fertilizers"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[120px]" 
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-red-600 text-white rounded-[24px] text-lg font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                  >
                    Save Record
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
