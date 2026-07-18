import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, AlertTriangle, TrendingDown } from 'lucide-react';

export function WarehouseInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: 0, unit: '', minThreshold: 0, category: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/warehouse/inventory');
      let data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        const initial = [
          { id: 'INV-1', name: 'Urea Fertilizer 50kg', quantity: 15, unit: 'Bags', minThreshold: 20, category: 'Fertilizer' },
          { id: 'INV-2', name: 'NPK 19-19-19', quantity: 45, unit: 'Bags', minThreshold: 10, category: 'Fertilizer' },
          { id: 'INV-3', name: 'Tomato Seeds (Hybrid)', quantity: 5, unit: 'Packs', minThreshold: 10, category: 'Seeds' },
        ];
        await Promise.all(initial.map(i => fetch('/api/warehouse/inventory', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(i)})));
        data = initial;
      }
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/warehouse/inventory', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
      setIsAdding(false);
      setFormData({ name: '', quantity: 0, unit: '', minThreshold: 0, category: '' });
      fetchInventory();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Warehouse & Inventory</h1>
          <p className="text-gray-500 font-medium">Track stock levels, categories, and low-stock alerts.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Stock
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search inventory..." className="bg-transparent border-none outline-none w-full text-sm font-medium" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-black text-gray-900">{item.quantity}</span> <span className="text-sm text-gray-500">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.minThreshold ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700">
                        <TrendingDown className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                        Optimal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 font-bold text-sm hover:text-indigo-800">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-indigo-600"/> Add Inventory</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                  <input required type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" placeholder="Bags, Kg, Liters..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Min Threshold</label>
                  <input required type="number" value={formData.minThreshold} onChange={e => setFormData({...formData, minThreshold: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700">Add Stock</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
