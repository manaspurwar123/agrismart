import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  PieChart as PieIcon, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');

  const reports = [
    { name: 'Financial Statement - June 2026', date: 'Jul 01, 2026', size: '1.2 MB', type: 'PDF' },
    { name: 'Income/Expense Summary - Q2 2026', date: 'Jun 30, 2026', size: '2.5 MB', type: 'XLSX' },
    { name: 'Rental Utilization Report', date: 'Jun 15, 2026', size: '850 KB', type: 'PDF' },
    { name: 'Farm Inventory Audit', date: 'Jun 01, 2026', size: '1.1 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-purple-700 uppercase tracking-[0.2em] mb-4 block">Intelligence Reports</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Financial Insights.</h1>
          <p className="text-xl text-gray-500 font-medium">Export and analyze your farm's financial performance data.</p>
        </div>
      </div>

      {/* Generator Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-[48px] p-16 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight leading-none">Generate Custom <br />Financial Statement</h2>
            <p className="text-gray-400 font-medium text-lg max-w-md">
              Compile your income, expenses, and rental performance into a single professional document.
            </p>
            <div className="flex gap-4">
              {['Monthly', 'Quarterly', 'Annual'].map(t => (
                <button 
                  key={t}
                  onClick={() => setReportType(t.toLowerCase())}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    reportType === t.toLowerCase() ? "bg-white text-gray-900" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Period</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="date" className="w-full pl-11 pr-4 py-4 bg-white/10 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Period</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="date" className="w-full pl-11 pr-4 py-4 bg-white/10 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            <button className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-purple-900/40">
              Generate PDF Report
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Recent Exports</h3>
          <button className="text-gray-400 font-bold hover:text-gray-900 flex items-center gap-2">
            Archive <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-4">
          {reports.map((report, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className={cn("w-6 h-6", report.type === 'PDF' ? 'text-red-500' : 'text-green-600')} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900">{report.name}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {report.type}
                </span>
                <button className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
