import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Sprout, 
  Target, 
  TrendingUp, 
  Droplets,
  Calendar,
  Zap,
  CheckCircle2,
  ChevronRight,
  Activity,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { FarmAnalytics as FarmAnalyticsType } from '../../types/analytics';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function FarmAnalytics() {
  const [data, setData] = useState<FarmAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network fetch
    setTimeout(() => {
      setData({
        performanceScore: 92,
        cropGrowthIndex: 1.5,
        soilHealthScore: 88,
        irrigationEfficiency: 90,
        productivityScore: 91,
        landUtilization: 85,
        harvestSuccessRate: 95,
        monthlyProduction: [
          { month: 'Jan', value: 400 },
          { month: 'Feb', value: 300 },
          { month: 'Mar', value: 500 },
          { month: 'Apr', value: 200 },
          { month: 'May', value: 600 },
          { month: 'Jun', value: 700 }
        ],
        cropDistribution: [
          { name: 'Wheat', value: 400 },
          { name: 'Rice', value: 300 },
          { name: 'Corn', value: 200 },
          { name: 'Soy', value: 100 }
        ]
      });
      setLoading(false);
    }, 600);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const performanceKpis = [
    { label: "Performance Score", value: data.performanceScore, suffix: "%", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Growth Index", value: data.cropGrowthIndex, suffix: "x", icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
    { label: "Soil Health", value: data.soilHealthScore, suffix: "/100", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Irrigation Efficiency", value: data.irrigationEfficiency, suffix: "%", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Productivity", value: data.productivityScore, suffix: "%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Land Utilization", value: data.landUtilization, suffix: "%", icon: Maximize2, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Harvest Success", value: data.harvestSuccessRate, suffix: "%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Farm Analytics</h1>
          <p className="text-gray-500 font-medium">Detailed performance monitoring and growth indices</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            Compare Farms
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            Generate Report
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceKpis.map((kpi, idx) => (
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
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}{kpi.suffix}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Production Trend */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Production Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Year</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyProduction}>
                <defs>
                  <linearGradient id="prodColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#prodColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Crop Performance Distribution</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Details</button>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cropDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {data.cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Insights Section */}
      <div className="bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Live AI Performance Audit</p>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">Your Farm is Operating at <span className="text-green-400">91% Productivity</span></h2>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Based on historical data and real-time monitoring of Plot A and Plot B, your irrigation efficiency has improved by 12% this quarter. However, soil nitrogen levels are trending downwards.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Optimal Sowing Window", val: "Next 12 Days", icon: Calendar },
                { label: "Water Saving Goal", val: "15,000 Liters", icon: Droplets },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-[32px] border border-white/10 group hover:bg-white/10 transition-all">
                  <item.icon className="w-6 h-6 text-indigo-400 mb-4" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xl font-black">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10">
            <h4 className="text-xl font-black tracking-tight mb-8">System Health Checks</h4>
            <div className="space-y-6">
              {[
                { label: "IoT Sensors Connectivity", status: "Healthy", val: "100%", color: "text-green-400" },
                { label: "Satellite Analysis", status: "Live", val: "Online", color: "text-blue-400" },
                { label: "AI Model Accuracy", status: "High", val: "98.2%", color: "text-indigo-400" },
                { label: "Database Synchronization", status: "Stable", val: "Syncing", color: "text-green-400" },
              ].map((check, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl group hover:translate-x-2 transition-transform cursor-default">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse" />
                      <span className="font-bold text-gray-300">{check.label}</span>
                   </div>
                   <div className="text-right">
                      <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", check.color)}>{check.status}</p>
                      <p className="text-sm font-black">{check.val}</p>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-indigo-600 rounded-[20px] font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 transition-all">
              Run Full Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
