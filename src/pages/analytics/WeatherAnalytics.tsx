import React, { useEffect, useState } from 'react';
import { 
  CloudRain, 
  TrendingUp, 
  Thermometer,
  ChevronRight,
  Wind,
  Droplets,
  Sun,
  CloudSun,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

export default function WeatherAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network fetch
    setTimeout(() => {
      setData({
        riskIndex: 12,
        temperatureTrend: [28, 29, 31, 32, 34, 33, 30, 29, 28, 27],
        rainfallHistory: [0, 5, 2, 0, 0, 0, 15, 20, 5, 0]
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

  const weatherKpis = [
    { label: "Current Temp", value: "32°C", trend: "+2°", icon: Thermometer, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Humidity", value: "65%", trend: "Stable", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Wind Speed", value: "12 km/h", trend: "Normal", icon: Wind, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Weather Risk", value: data.riskIndex + "%", trend: "Low", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Weather Analytics</h1>
          <p className="text-gray-500 font-medium">Hyper-local climatic tracking and risk assessment</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            7-Day Forecast
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            Download Impact Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {weatherKpis.map((kpi, idx) => (
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
                kpi.trend === 'Low' || kpi.trend === 'Normal' || kpi.trend === 'Stable' ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
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
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Temperature & Rainfall Sync</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.temperatureTrend.map((t: any, i: any) => ({ day: i + 1, temp: t, rain: data.rainfallHistory[i] }))}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={4} fill="url(#tempGradient)" />
                    <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={4} fill="url(#rainGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-indigo-900 p-10 rounded-[40px] shadow-sm text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-3 bg-white/10 rounded-2xl">
                    <CloudSun className="w-6 h-6 text-yellow-400" />
                 </div>
                 <h3 className="text-xl font-black tracking-tight leading-none uppercase tracking-tighter">Impact Report</h3>
              </div>
              <p className="text-sm font-bold text-indigo-300 mb-8 leading-relaxed uppercase tracking-tighter">The current dry spell may reduce soil moisture by 8% in the next 72 hours. Supplement irrigation in Plot A is recommended.</p>
              <div className="space-y-6">
                 {[
                   { label: "Humidity Variance", val: "-12%", icon: Droplets },
                   { label: "UV Index", val: "High (8)", icon: Sun },
                   { label: "Pressure", val: "1012 hPa", icon: Activity },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                         <item.icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                      </div>
                      <span className="text-sm font-black tracking-tighter">{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
