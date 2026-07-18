import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Sprout, 
  Target, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Settings, 
  Zap,
  Droplets,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { DashboardStats } from '../../types/analytics';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const AnimatedCounter = ({ value, duration = 1.5, prefix = "", suffix = "" }: { value: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end) * 5;
    
    // Safety check for very large increments
    if (incrementTime < 1) incrementTime = 1;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{prefix}{(count || 0).toLocaleString()}{suffix}</span>;
};

export default function BusinessDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Farms", value: stats.totalFarms, icon: Sprout, color: "text-green-600", bg: "bg-green-50", trend: "+2" },
    { title: "Total Crops", value: stats.totalCrops, icon: Sprout, color: "text-blue-600", bg: "bg-blue-50", trend: "+1" },
    { title: "Expected Yield", value: stats.expectedYield, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50", suffix: " tons" },
    { title: "Current Yield", value: stats.currentYield, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", suffix: " tons" },
    { title: "Total Revenue", value: stats.totalRevenue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", prefix: "$" },
    { title: "Total Expenses", value: stats.totalExpenses, icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50", prefix: "$" },
    { title: "Net Profit", value: stats.netProfit, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50", prefix: "$" },
    { title: "Water Used", value: stats.waterConsumption, icon: Droplets, color: "text-cyan-600", bg: "bg-cyan-50", suffix: " m³" },
    { title: "Active Farmers", value: stats.activeFarmers, icon: Users, color: "text-purple-600", bg: "bg-purple-50", trend: "+12%" },
    { title: "Active Buyers", value: stats.activeBuyers, icon: ShoppingBag, color: "text-pink-600", bg: "bg-pink-50", trend: "+5%" },
    { title: "Equipment", value: stats.activeEquipment, icon: Settings, color: "text-slate-600", bg: "bg-slate-50", trend: "Normal" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50", trend: "+18%" },
    { title: "Market Revenue", value: stats.marketplaceRevenue, icon: DollarSign, color: "text-green-600", bg: "bg-green-50", prefix: "$" },
    { title: "Rental Revenue", value: stats.equipmentRentalRevenue, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50", prefix: "$" },
    { title: "Gov Benefits", value: stats.benefitsReceived, icon: Target, color: "text-blue-600", bg: "bg-blue-50", prefix: "$" },
    { title: "AI Predictions", value: stats.aiPredictionsGenerated, icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", trend: "Live" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Business Dashboard</h1>
          <p className="text-gray-500 font-medium">Real-time enterprise agricultural analytics & KPI tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Custom Widget
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 border border-gray-100 relative overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-20 transition-opacity duration-700", stat.bg)} />
            
            <div className="flex items-start justify-between mb-6">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              {stat.trend && (
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  stat.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                )}>
                  {stat.trend}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {stat.title}
              </p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </h3>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>Real-time Syncing</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Enterprise Revenue Over Time</h3>
              <p className="text-sm font-medium text-gray-400">Aggregated revenue from all modules</p>
            </div>
            <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', rev: 4000, exp: 2400 },
                { name: 'Feb', rev: 3000, exp: 1398 },
                { name: 'Mar', rev: 5000, exp: 3800 },
                { name: 'Apr', rev: 4780, exp: 3908 },
                { name: 'May', rev: 6890, exp: 4800 },
                { name: 'Jun', rev: 8390, exp: 3800 },
              ]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#111827' }}
                />
                <Area type="monotone" dataKey="rev" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="exp" stroke="#f43f5e" strokeWidth={4} fill="transparent" strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Sidebar on Dashboard */}
        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
                <h3 className="text-xl font-black tracking-tight">AI Strategic Insights</h3>
              </div>
              <div className="space-y-6">
                {[
                  { title: "Profit Maximization", text: "Switching Plot B to Potato could increase revenue by 24%", icon: TrendingUp },
                  { title: "Risk Alert", text: "Impending rain forecast. Suggesting early harvest for Wheat", icon: AlertTriangle },
                ].map((insight, idx) => (
                  <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4 mb-3">
                      <insight.icon className="w-4 h-4 text-indigo-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{insight.title}</p>
                    </div>
                    <p className="text-sm font-bold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{insight.text}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                Full AI Analysis
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
             <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Crop Distribution</h3>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Wheat', value: 400 },
                        { name: 'Rice', value: 300 },
                        { name: 'Cotton', value: 200 },
                        { name: 'Others', value: 100 },
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[ '#4f46e5', '#10b981', '#f59e0b', '#ef4444' ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { name: 'Wheat', color: 'bg-indigo-600' },
                  { name: 'Rice', color: 'bg-emerald-500' },
                  { name: 'Cotton', color: 'bg-amber-500' },
                  { name: 'Others', color: 'bg-rose-500' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", c.color)} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{c.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
