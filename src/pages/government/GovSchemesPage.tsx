import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  ArrowRight, 
  ShieldCheck, 
  ScrollText, 
  Info,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { GovScheme } from '../../types';

export const GovSchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchSchemes();
    fetchSavedSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes');
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedSchemes = async () => {
    try {
      const res = await fetch('/api/schemes/saved');
      const data = await res.json();
      setSavedIds(Array.isArray(data) ? data.map((s: any) => s.id) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async (schemeId: string) => {
    try {
      if (savedIds.includes(schemeId)) {
        // In a real app, delete from saved
        setSavedIds(prev => prev.filter(id => id !== schemeId));
      } else {
        await fetch('/api/schemes/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schemeId })
        });
        setSavedIds(prev => [...prev, schemeId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = (s.title || '').toLowerCase().includes((search || '').toLowerCase()) || 
                         (s.description || '').toLowerCase().includes((search || '').toLowerCase());
    const matchesFilter = filter === 'All' || s.department.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Agriculture', 'Insurance', 'Subsidies', 'Credit'];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic">Welfare Schemes</h1>
          <p className="text-gray-500 font-medium text-lg">Discover and apply for government initiatives designed for you.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-2 border-gray-100 h-16 pl-14 pr-8 rounded-[20px] w-full md:w-80 font-bold focus:border-green-500 outline-none transition-all shadow-sm"
            />
          </div>
          <Button className="h-16 w-16 bg-white border-2 border-gray-100 rounded-[20px] flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500 transition-all shadow-sm">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              filter === cat 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                : 'bg-white text-gray-400 border-2 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-[40px] h-80 animate-pulse border-2 border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSchemes.map((scheme, i) => (
              <motion.div
                key={scheme.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="bg-white rounded-[40px] border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-green-500 transition-all"
              >
                {/* Banner */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={scheme.bannerUrl || `https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=600`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={scheme.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
                    <span className="bg-green-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                      {scheme.status}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSave(scheme.id); }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        savedIds.includes(scheme.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/40'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedIds.includes(scheme.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ScrollText className="w-3 h-3" /> {scheme.department}
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-green-600 transition-colors">{scheme.title}</h3>
                  </div>

                  <p className="text-gray-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Benefits</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{scheme.benefits[0]}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Eligibility</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{scheme.eligibilityCriteria[0]}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-4">
                    <Button 
                      onClick={() => navigate(`/government/schemes/${scheme.id}`)}
                      className="flex-1 h-14 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-14 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredSchemes.length === 0 && (
        <div className="bg-white rounded-[60px] p-24 text-center border-2 border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200">
            <Search className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 italic">No matching schemes</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">Try adjusting your filters or search keywords to find what you're looking for.</p>
          <Button onClick={() => { setSearch(''); setFilter('All'); }} className="bg-gray-900 text-white rounded-2xl px-12 py-4 h-16 font-black uppercase tracking-widest text-xs">Clear Search</Button>
        </div>
      )}
    </div>
  );
};
