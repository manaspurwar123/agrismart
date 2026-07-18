import React, { useEffect, useState } from 'react';
import { 
  Droplets, 
  TrendingUp, 
  Droplet,
  ChevronRight,
  TrendingDown,
  Activity,
  Zap,
  Sprout,
  Waves
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

export default function WaterAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
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

  const waterKpis = [
    { label: "Daily Consumption", value: "850 m³", trend: "-5%", icon: Droplet, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Irrigation Efficiency", value: "88%", trend: "+12%", icon: Waves, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Water Saving Score", value: "92/100", trend: "High", icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
    { label: "Future Requirement", value: "1,200 m³", trend: "Predicted", icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Water Analytics</h1>
          <p className="text-gray-500 font-medium">Real-time monitoring of irrigation efficiency and water conservation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            Configure Sensors
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            AI Optimization
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {waterKpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Consumption Trend (m³)</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { month: 'Mon', val: 400 }, { month: 'Tue', val: 300 },
                   { month: 'Wed', val: 500 }, { month: 'Thu', val: 450 },
                   { month: 'Fri', val: 600 }, { month: 'Sat', val: 550 },
                   { month: 'Sun', val: 400 },
                 ]}>
                    <defs>
                      <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={4} fill="url(#waterGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Irrigation Performance Analysis</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                    { name: 'Farm A', val: 85 }, { name: 'Farm B', val: 72 },
                    { name: 'Farm C', val: 94 }, { name: 'Farm D', val: 68 },
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="val" fill="#4f46e5" radius={[12, 12, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
