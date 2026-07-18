import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Users, 
  Calendar,
  AlertCircle,
  ShieldCheck,
  Zap,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { GovScheme } from '../../types';

export default function GovSchemeManagement() {
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/gov-schemes');
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Government Schemes</h1>
          <p className="text-gray-500 font-medium">Create and manage agricultural subsidies, welfare programs, and insurance schemes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Scheme
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search schemes by title or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none">
            <option>Category: All</option>
            <option>Subsidies</option>
            <option>Insurance</option>
            <option>Loans</option>
            <option>Welfare</option>
          </select>
          <select className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none">
            <option>Status: All</option>
            <option>Active</option>
            <option>Closed</option>
            <option>Archived</option>
          </select>
          <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Schemes Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white h-64 rounded-[40px] animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme, idx) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {scheme.bannerUrl ? (
                  <img src={scheme.bannerUrl} alt={scheme.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Globe className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border",
                    scheme.status === 'Active' ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                  )}>
                    {scheme.status}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{scheme.department}</p>
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-green-600 transition-colors line-clamp-1">{scheme.title}</h3>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">1,245 Applicants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scheme Information</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Department</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Benefits</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchemes.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{scheme.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">Scheme ID: {scheme.id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600">{scheme.department}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        {scheme.benefits.slice(0, 2).map((benefit, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-widest">{benefit}</span>
                        ))}
                        {scheme.benefits.length > 2 && (
                          <span className="px-2 py-0.5 bg-green-50 text-[10px] font-black text-green-600 rounded uppercase tracking-widest">+{scheme.benefits.length - 2} More</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        scheme.status === 'Active' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      )}>
                        {scheme.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredSchemes.length} schemes</p>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
