import React, { useEffect, useState } from 'react';
import { 
  Bug, 
  TrendingUp, 
  Target, 
  Droplets,
  Calendar,
  Zap,
  AlertTriangle,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

export default function DiseaseAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/disease')
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

  const diseaseKpis = [
    { label: "Healthy Crop Ratio", value: data.healthyPercentage + "%", trend: "High", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Recovery Rate", value: data.recoveryRate + "%", trend: "+5%", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "High Risk Clusters", value: "2 Areas", trend: "Stable", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Common Threat", value: data.commonDiseases[0]?.name || "None", trend: "In Check", icon: Bug, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Disease Analytics</h1>
          <p className="text-gray-500 font-medium">Pathogen tracking and proactive crop health monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            Register Outbreak
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            AI Scanner Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {diseaseKpis.map((kpi, idx) => (
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
                kpi.trend === 'High' || kpi.trend === 'In Check' || kpi.trend === 'Stable' || kpi.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
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
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Disease Prevalence History</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { month: 'Jan', value: 4 }, { month: 'Feb', value: 2 },
                   { month: 'Mar', value: 5 }, { month: 'Apr', value: 12 },
                   { month: 'May', value: 8 }, { month: 'Jun', value: 5 },
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#f43f5e" radius={[12, 12, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Threat Distribution</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={data.commonDiseases}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="name"
                    >
                      {[ '#f43f5e', '#f59e0b', '#4f46e5', '#10b981' ].map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-8">
              {data.commonDiseases.map((d: any, i: any) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-indigo-50 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", [ 'bg-rose-500', 'bg-amber-500', 'bg-indigo-600', 'bg-emerald-500' ][i])} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.name}</span>
                   </div>
                   <span className="text-sm font-black text-gray-900 tracking-tighter">{d.count} Cases</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
