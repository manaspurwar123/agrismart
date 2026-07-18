import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Search, Filter, Calendar, MapPin, 
  Trash2, Eye, Download, ChevronRight, Sprout,
  FilterX, TrendingUp, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CropRecommendation } from '../types';
import { cn } from '../lib/utils';

export default function RecommendationHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCrop, setFilterCrop] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/crop-recommendation/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecommendation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    try {
      await axios.delete(`/api/crop-recommendation/${id}`);
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const filteredHistory = history.filter(r => {
    const matchesSearch = (r.farmName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                         (r.recommendedCrop || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesState = !filterState || r.state === filterState;
    const matchesCrop = !filterCrop || r.recommendedCrop === filterCrop;
    return matchesSearch && matchesState && matchesCrop;
  });

  const uniqueStates = Array.from(new Set(history.map(r => r.state)));
  const uniqueCrops = Array.from(new Set(history.map(r => r.recommendedCrop)));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <History className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-emerald-800 font-bold">Loading your agricultural history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl border border-white">
              <History size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recommendation History</h1>
              <p className="text-gray-600 font-medium">Tracking your farm's journey and AI insights.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/crop-recommendation')}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all active:scale-95"
          >
            <Sprout size={24} />
            New Recommendation
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-[32px] shadow-xl border border-white/40 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Farm or Crop..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="p-4 bg-emerald-50/50 border border-transparent focus:bg-white rounded-2xl outline-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="">All States</option>
              {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterCrop}
              onChange={e => setFilterCrop(e.target.value)}
              className="p-4 bg-emerald-50/50 border border-transparent focus:bg-white rounded-2xl outline-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="">All Crops</option>
              {uniqueCrops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(filterState || filterCrop || searchTerm) && (
              <button
                onClick={() => { setFilterState(''); setFilterCrop(''); setSearchTerm(''); }}
                className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"
              >
                <FilterX size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center space-y-6 shadow-xl">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">No recommendations found</h3>
            <p className="text-gray-400">Try adjusting your filters or generate a new recommendation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredHistory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[40px] p-8 shadow-xl border border-transparent hover:border-emerald-200 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <button 
                        onClick={() => deleteRecommendation(item.id)}
                        className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{item.recommendedCrop}</h3>
                      <p className="text-gray-400 font-bold flex items-center gap-1">
                        <MapPin size={14} />
                        {item.farmName}, {item.district}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <TrendingUp size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Est. Profit</span>
                        </div>
                        <p className="font-bold text-gray-900">₹{(item.estimatedProfit || 0).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600">
                          <Sprout size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Yield</span>
                        </div>
                        <p className="font-bold text-gray-900">{item.expectedYield}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/recommendation/${item.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all active:scale-95"
                      >
                        <Eye size={18} />
                        View
                      </button>
                      <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-colors active:scale-95">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
