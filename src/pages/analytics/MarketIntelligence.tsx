import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ChevronRight,
  Target,
  Activity,
  Zap,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';

export default function MarketIntelligence() {
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

  const marketKpis = [
    { label: "Live Market Index", value: "2,450.2", trend: "+1.2%", icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Price Volatility", value: "Low", trend: "Stable", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Demand Forecast", value: "High", trend: "+15%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Best Selling Crop", value: "Wheat", trend: "Primary", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Market Intelligence</h1>
          <p className="text-gray-500 font-medium">Real-time global market trends and price predictions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            View Price Map
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            Trade Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketKpis.map((kpi, idx) => (
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
                kpi.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              )}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{kpi.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none pt-2">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Global Price Trend</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[
                   { month: 'Jan', val: 1950 }, { month: 'Feb', val: 2100 },
                   { month: 'Mar', val: 2050 }, { month: 'Apr', val: 2300 },
                   { month: 'May', val: 2200 }, { month: 'Jun', val: 2450 },
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Market Demand Matrix</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Wheat', demand: 85 }, { name: 'Rice', demand: 72 },
                   { name: 'Maize', demand: 64 }, { name: 'Cotton', demand: 92 },
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="demand" fill="#10b981" radius={[12, 12, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
