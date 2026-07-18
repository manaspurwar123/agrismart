import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Search, 
  Filter, 
  Award, 
  Languages, 
  Clock, 
  Video, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  MapPin,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Expert } from '../../types';

export function ExpertConsultationPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Agronomy', 'Plant Pathology', 'Soil Science', 'Irrigation', 'Marketing'];

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const res = await fetch('/api/experts');
      if (res.ok) {
        setExperts(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExperts = activeCategory === 'All' 
    ? experts 
    : experts.filter(e => e.specialization.includes(activeCategory));

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 w-24 h-24 bg-green-700 rounded-[32px] flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
          <ShieldCheck className="text-white w-12 h-12" />
        </div>
        <div className="relative z-10 flex-grow text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Verified Expert Consultation</h1>
          <p className="text-sm font-medium text-gray-500 max-w-2xl">
            Get personalized advice from certified agriculture scientists and veteran farmers. Solving your crop problems with precision and science.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">24 Experts Online</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-72 shrink-0 space-y-8">
          <div className="sticky top-48">
            <h3 className="font-black text-gray-900 tracking-tighter mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-green-600" />
              Expert Search
            </h3>
            
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search specialty..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-4">Specialization</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeCategory === cat 
                      ? "bg-green-700 text-white shadow-lg shadow-green-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <Zap className="text-blue-600 w-8 h-8 mb-4 fill-blue-600" />
              <h4 className="font-black text-gray-900 mb-2 tracking-tighter leading-tight">Instant AI Expert</h4>
              <p className="text-xs font-medium text-gray-600 mb-6">Need an immediate answer? Use our AI assistant for quick advice.</p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 hover:bg-blue-100 transition-all">
                Try AI Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="flex-grow space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredExperts.map((expert, idx) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
                >
                  <div className="p-8">
                    <div className="flex gap-6 mb-8">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-2 border-gray-50 group-hover:scale-105 transition-transform duration-500">
                          <img src={expert.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center">
                          <Zap className="text-white w-3 h-3 fill-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-gray-900 tracking-tighter">{expert.name}</h3>
                          <ShieldCheck className="text-blue-500 w-4 h-4 fill-blue-50" />
                        </div>
                        <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">{expert.qualification}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-gray-900">{expert.rating}</span>
                          </div>
                          <div className="w-px h-3 bg-gray-200" />
                          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            {expert.experience} YRS EXP.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Specialization</p>
                        <div className="flex flex-wrap gap-2">
                          {expert.specialization.split(',').map((s, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 font-medium line-clamp-2 italic leading-relaxed">
                        "{expert.bio}"
                      </p>

                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <Languages className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{expert.languages.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">PAN INDIA</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 bg-gray-50/50 flex gap-3">
                    <button className="flex-grow py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl text-sm font-black tracking-tighter hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="flex-grow py-4 bg-green-700 text-white rounded-2xl text-sm font-black tracking-tighter shadow-lg shadow-green-100 hover:bg-green-800 transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Book Consult
                    </button>
                    <button className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-700 transition-all">
                      <FileText className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && [1, 2].map(i => (
              <div key={i} className="bg-white rounded-[40px] border border-gray-100 p-8 space-y-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl" />
                  <div className="space-y-3 py-2">
                    <div className="w-48 h-6 bg-gray-100 rounded-full" />
                    <div className="w-32 h-4 bg-gray-50 rounded-full" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-50 rounded-full" />
                  <div className="w-full h-4 bg-gray-50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
