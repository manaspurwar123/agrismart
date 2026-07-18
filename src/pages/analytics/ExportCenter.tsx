import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Table, 
  Image as ImageIcon,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
  Sprout,
  DollarSign,
  Droplets,
  Target,
  FileSpreadsheet,
  FileCode,
  FileBox,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ExportCenter() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`${format} export generated successfully!`);
    }, 2000);
  };

  const exportTypes = [
    { name: 'PDF Document', format: 'PDF', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50', description: 'Complete visual report including charts, images, and AI summaries.' },
    { name: 'Excel Sheet', format: 'Excel', icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50', description: 'Structured raw data sets, historical metrics and calculation tables.' },
    { name: 'CSV File', format: 'CSV', icon: Table, color: 'text-blue-600', bg: 'bg-blue-50', description: 'Lightweight comma-separated values for third-party BI integrations.' },
    { name: 'JSON Data', format: 'JSON', icon: FileCode, color: 'text-amber-600', bg: 'bg-amber-50', description: 'Technical data export for developer and system integrations.' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase tracking-tighter">Export Center</h1>
          <p className="text-gray-500 font-medium uppercase tracking-tighter">Enterprise-grade data exporting and external system synchronization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {exportTypes.map((type, idx) => (
          <motion.div
            key={type.format}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-100 transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={cn("p-5 rounded-3xl", type.bg)}>
                <type.icon className={cn("w-8 h-8", type.color)} />
              </div>
              <button className="p-3 text-gray-300 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 mb-10">
               <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">{type.name}</h3>
               <p className="text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-tighter">{type.description}</p>
            </div>

            <button 
              onClick={() => handleExport(type.format)}
              disabled={!!exporting}
              className="w-full py-5 bg-gray-50 text-gray-900 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
               {exporting === type.format ? (
                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
               ) : (
                 <>Generate {type.format} Export <Download className="w-4 h-4" /></>
               )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight leading-tight uppercase tracking-tighter text-white">Advanced Data Bulk Export</h2>
              <p className="text-lg text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">Export your entire farm history, including soil analysis, weather data, and profit margins for the past 5 years.</p>
              <div className="flex flex-wrap items-center gap-4">
                 {[ 'All Farms', 'All Seasons', 'Detailed Logs', 'AI Metadata' ].map((tag, i) => (
                    <div key={i} className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                       {tag}
                    </div>
                 ))}
              </div>
           </div>
           <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 space-y-8">
              <h4 className="text-xl font-black tracking-tight mb-4">Export Configuration</h4>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Date Range</label>
                    <select className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-widest">
                       <option>Last 12 Months</option>
                       <option>Current Season</option>
                       <option>Custom Range</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Optimization</label>
                    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter">Enable AI Compression</span>
                       <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                       </div>
                    </div>
                 </div>
              </div>
              <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                 Begin Bulk Export Process <Zap className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
