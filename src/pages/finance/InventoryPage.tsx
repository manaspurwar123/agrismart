import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Package, 
  AlertTriangle, 
  ChevronRight,
  X,
  PlusCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { cn } from '../../lib/utils';

export const FarmInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Farm Tools', 'Spare Parts', 'Fuel Stock'];

  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    currentStock: '',
    unit: 'kg',
    lowStockThreshold: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          currentStock: Number(formData.currentStock),
          lowStockThreshold: Number(formData.lowStockThreshold)
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchInventory();
        setFormData({
          name: '',
          category: 'Seeds',
          currentStock: '',
          unit: 'kg',
          lowStockThreshold: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-amber-700 uppercase tracking-[0.2em] mb-4 block">Stock Management</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Farm Inventory.</h1>
          <p className="text-xl text-gray-500 font-medium">Keep track of your vital farm supplies and never run out.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center gap-3 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Add Supply Item
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: inventory.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock Alerts', value: inventory.filter(i => i.currentStock <= i.lowStockThreshold && i.currentStock > 0).length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Out of Stock', value: inventory.filter(i => i.currentStock === 0).length, icon: Database, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Categories', value: new Set(inventory.map(i => i.category)).size, icon: Filter, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search seeds, fertilizers, fuel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 h-64 rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInventory.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col group relative"
              >
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-6 right-6 p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start justify-between mb-8">
                  <div className={cn(
                    "w-16 h-16 rounded-[24px] flex items-center justify-center",
                    item.currentStock === 0 ? "bg-red-50 text-red-600" : 
                    item.currentStock <= item.lowStockThreshold ? "bg-orange-50 text-orange-600" : 
                    "bg-blue-50 text-blue-600"
                  )}>
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                      item.currentStock === 0 ? "bg-red-100 text-red-700" : 
                      item.currentStock <= item.lowStockThreshold ? "bg-orange-100 text-orange-700" : 
                      "bg-green-100 text-green-700"
                    )}>
                      {item.currentStock === 0 ? 'Out of Stock' : item.currentStock <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last updated {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">Current Level</span>
                      <span className="text-gray-900">{item.currentStock} {item.unit} / {item.lowStockThreshold * 5} {item.unit}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.currentStock / (item.lowStockThreshold * 5)) * 100, 100)}%` }}
                        className={cn(
                          "h-full transition-all duration-1000",
                          item.currentStock === 0 ? "bg-red-500" : 
                          item.currentStock <= item.lowStockThreshold ? "bg-orange-500" : 
                          "bg-blue-500"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto flex gap-3">
                  <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
                    Manage Stock
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
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
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">New Supply Item</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddItem} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. NPK Fertilizer 19:19:19"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                      <input 
                        type="text" 
                        required
                        placeholder="kg, liters, packets"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Stock</label>
                      <input 
                        type="number" 
                        required
                        placeholder="0"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Low Stock Threshold</label>
                      <input 
                        type="number" 
                        required
                        placeholder="Notify me below..."
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-amber-600 text-white rounded-[24px] text-lg font-black shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center justify-center gap-3"
                  >
                    Add to Inventory
                    <ArrowRight className="w-6 h-6" />
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
