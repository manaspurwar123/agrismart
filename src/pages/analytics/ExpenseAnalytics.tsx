import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingDown, 
  PieChart as PieIcon,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Briefcase,
  Zap,
  Droplets,
  Sprout,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

export default function ExpenseAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/finance')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const expenseKpis = [
    { label: "Total Monthly Expenses", value: "$12,450", trend: "+2.4%", icon: CreditCard, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Fuel Cost Efficiency", value: "92%", trend: "Optimal", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Labour Cost Impact", value: "42%", trend: "-5%", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Inventory Overhead", value: "$4,200", trend: "Low", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Expense Analytics</h1>
          <p className="text-gray-500 font-medium">Detailed financial transparency and resource expenditure tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            Import Bank Data
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            Download P&L
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {expenseKpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl", kpi.bg)}>
                <kpi.icon className={cn("w-6 h-6", kpi.color)} />
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                kpi.trend.startsWith('+') ? "bg-rose-100 text-rose-700" : "bg-green-100 text-green-700"
              )}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{kpi.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none pt-2">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Monthly Expenditure Trend</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.revenue.map((r: any, i: any) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], exp: data.expenses[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="exp" fill="#4f46e5" radius={[12, 12, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Category Breakdown</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={data.categories}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[ '#4f46e5', '#10b981', '#f59e0b', '#ef4444' ].map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-8">
              {data.categories.map((c: any, i: any) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-indigo-50 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", [ 'bg-indigo-600', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500' ][i])} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.name}</span>
                   </div>
                   <span className="text-sm font-black text-gray-900 tracking-tighter">${c.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-indigo-950 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight leading-none uppercase tracking-tighter">Reduce Overhead by 15%</h2>
              <p className="text-lg text-indigo-200 font-medium max-w-xl leading-relaxed">Our AI detected redundant logistics patterns. Consolidation of your transport routes could save $1,800/month.</p>
           </div>
           <button className="px-12 py-5 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-900/50 hover:bg-indigo-700 transition-all border border-indigo-400/30">
              Apply Optimization
           </button>
        </div>
      </div>
    </div>
  );
}
