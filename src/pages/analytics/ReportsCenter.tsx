import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Archive, 
  Calendar,
  ChevronRight,
  MoreVertical,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Sprout,
  DollarSign,
  Droplets,
  CloudRain,
  Bug,
  ShoppingBag,
  Settings,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Report } from '../../types/analytics';

export default function ReportsCenter() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filteredReports = reports.filter(r => 
    (filterType === 'All' || r.type.toLowerCase() === filterType.toLowerCase()) &&
    (r.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const reportTypes = [
    { name: 'All', icon: FileText },
    { name: 'Farm', icon: Sprout },
    { name: 'Finance', icon: DollarSign },
    { name: 'Weather', icon: CloudRain },
    { name: 'Disease', icon: Bug },
    { name: 'Market', icon: ShoppingBag },
    { name: 'Equipment', icon: Settings },
    { name: 'Gov Scheme', icon: Target },
    { name: 'Inventory', icon: Archive },
    { name: 'AI Prediction', icon: Zap },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase tracking-tighter">Reports Center</h1>
          <p className="text-gray-500 font-medium uppercase tracking-tighter">Unified center for generating and managing farm performance reports</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col xl:flex-row items-center gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search reports by title, ID or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none uppercase tracking-widest placeholder:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
           {reportTypes.map((type) => (
             <button
               key={type.name}
               onClick={() => setFilterType(type.name)}
               className={cn(
                 "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0",
                 filterType === type.name ? "bg-indigo-900 text-white shadow-xl shadow-indigo-100" : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 shadow-sm"
               )}
             >
               <type.icon className="w-4 h-4" />
               {type.name}
             </button>
           ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {filteredReports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-100 transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                <FileText className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors"><Download className="w-5 h-5" /></button>
                 <button className="p-2 text-gray-300 hover:text-rose-600 transition-colors"><Archive className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  Generated {new Date(report.createdAt).toLocaleDateString()}
               </div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{report.title}</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Report ID: <span className="text-gray-900">{report.id}</span></p>
            </div>

            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">A</div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">2 Shared</span>
               </div>
               <button className="flex items-center gap-2 text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all">
                  Open Report <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scheduler Section */}
      <div className="bg-indigo-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight leading-none uppercase tracking-tighter">Automate Your Insights</h2>
              <p className="text-lg text-indigo-200 font-medium max-w-xl leading-relaxed uppercase tracking-tighter">Schedule weekly or monthly performance reports delivered directly to your inbox or WhatsApp.</p>
           </div>
           <button className="px-12 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-50 transition-all flex items-center gap-3 shrink-0">
              Set Schedule <Plus className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
