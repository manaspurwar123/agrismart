import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowRight, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  History,
  TrendingDown,
  TrendingUp,
  RefreshCcw,
  IndianRupee,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { InventoryItem } from '../../types';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const updateStock = async (id: string, amount: number) => {
    setUpdatingId(id);
    try {
      const item = inventory.find(i => i.id === id);
      if (!item) return;
      const newLevel = Math.max(0, item.currentStock + amount);
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStock: newLevel })
      });
      if (res.ok) fetchInventory();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInventory = inventory.filter(i => 
    (i.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const lowStockItems = inventory.filter(i => i.currentStock < 10 && i.currentStock > 0);
  const outOfStockItems = inventory.filter(i => i.currentStock === 0);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Inventory Control</h1>
          <p className="text-gray-500 font-medium">Real-time stock tracking and replenishment</p>
        </div>

        {/* Alerts & Critical Status */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Items</p>
            <h4 className="text-4xl font-black text-gray-900 mb-4">{inventory.length}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> Fully Managed
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <AlertTriangle className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Low Stock</p>
            <h4 className="text-4xl font-black text-orange-500 mb-4">{lowStockItems.length}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
              <RefreshCcw className="w-3 h-3" /> Needs Attention
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500">
              <TrendingDown className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Out of Stock</p>
            <h4 className="text-4xl font-black text-red-500 mb-4">{outOfStockItems.length}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit">
              <History className="w-3 h-3" /> Restock Required
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-[48px] border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b-2 border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-12 outline-none transition-all font-bold"
              />
              <Search className="absolute left-4 top-4 w-6 h-6 text-gray-300" />
            </div>
            <Button onClick={fetchInventory} variant="outline" className="gap-2 border-gray-100 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">
              <RefreshCcw className="w-4 h-4" /> Refresh Data
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Stock</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Adjust Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.currentStock <= 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-gray-900">{item.currentStock}</div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.unit}</span>
                        {item.currentStock < 10 && (
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${item.currentStock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            <AlertTriangle className="w-3 h-3" /> {item.currentStock === 0 ? 'Out' : 'Low'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm font-bold text-gray-500">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(item.lastUpdated).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex bg-gray-100 border-2 border-gray-100 rounded-2xl p-1">
                          <button 
                            disabled={updatingId === item.id}
                            onClick={() => updateStock(item.id, -10)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all font-black"
                          >
                            -10
                          </button>
                          <button 
                            disabled={updatingId === item.id}
                            onClick={() => updateStock(item.id, -1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all font-black"
                          >
                            -1
                          </button>
                          <div className="w-px h-6 bg-gray-200 self-center mx-1" />
                          <button 
                            disabled={updatingId === item.id}
                            onClick={() => updateStock(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 transition-all font-black"
                          >
                            +1
                          </button>
                          <button 
                            disabled={updatingId === item.id}
                            onClick={() => updateStock(item.id, 10)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 transition-all font-black"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock Guide */}
        <div className="mt-12 bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <TrendingUp className="w-48 h-48" />
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-black mb-6">Smart Restock AI</h3>
              <p className="text-white/60 font-medium text-lg mb-8 leading-relaxed">
                Based on current market demand and seasonal trends, we recommend restocking <span className="text-green-400 font-bold">Pulses</span> and <span className="text-green-400 font-bold">Grains</span> within the next 15 days.
              </p>
              <div className="flex gap-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white rounded-[20px] px-8 py-4 font-black uppercase tracking-widest text-xs">
                  View Market Demand
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-[20px] px-8 py-4 font-black uppercase tracking-widest text-xs">
                  Download Full Report
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Market Demand', value: 'High', color: 'text-green-400' },
                { label: 'Forecast', value: '+24%', color: 'text-blue-400' },
                { label: 'Avg Sale Rate', value: '45/Day', color: 'text-orange-400' },
                { label: 'Price Trend', value: 'Rising', color: 'text-red-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                  <h4 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
