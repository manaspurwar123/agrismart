import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  Clock, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Leaf, 
  Globe, 
  MessageSquare, 
  AlertTriangle,
  FileText,
  DollarSign,
  Cpu,
  Shield
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const revenueData = [
  { month: 'Jan', revenue: 45000, profit: 32000 },
  { month: 'Feb', revenue: 52000, profit: 38000 },
  { month: 'Mar', revenue: 48000, profit: 35000 },
  { month: 'Apr', revenue: 61000, profit: 45000 },
  { month: 'May', revenue: 55000, profit: 41000 },
  { month: 'Jun', revenue: 67000, profit: 52000 },
  { month: 'Jul', revenue: 72000, profit: 58000 },
];

const userGrowthData = [
  { date: '01/07', farmers: 120, buyers: 45, experts: 12 },
  { date: '05/07', farmers: 145, buyers: 52, experts: 14 },
  { date: '10/07', farmers: 180, buyers: 68, experts: 18 },
  { date: '15/07', farmers: 210, buyers: 85, experts: 22 },
  { date: '20/07', farmers: 245, buyers: 102, experts: 25 },
  { date: '25/07', farmers: 290, buyers: 128, experts: 28 },
  { date: '30/07', farmers: 340, buyers: 155, experts: 32 },
];

const categoryData = [
  { name: 'Cereals', value: 400 },
  { name: 'Vegetables', value: 300 },
  { name: 'Fruits', value: 300 },
  { name: 'Spices', value: 200 },
];

const aiRequestData = [
  { name: 'Crop Rec', count: 1250 },
  { name: 'Disease Det', count: 850 },
  { name: 'Soil Anal', count: 450 },
  { name: 'Weather', count: 2100 },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Users', value: '1,245', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Farmers', value: '845', change: '+8.2%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Buyers', value: '312', change: '+15.4%', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Experts', value: '88', change: '+5.1%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Today\'s Regs', value: '24', change: '+2', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Active Listings', value: '458', change: '+32', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Orders', value: '1,854', change: '+21%', icon: Truck, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Revenue', value: '₹4.2M', change: '+18%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Platform Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back, Super Admin. Here's what's happening on your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                stat.change.startsWith('+') ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Financial Performance</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Revenue vs Profit</p>
            </div>
            <select className="bg-gray-50 border-transparent rounded-xl py-2 px-4 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none">
              <option>Last 7 Months</option>
              <option>Last 12 Months</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Marketplace Share</h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">By Product Category</p>
          <div className="flex-grow h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm font-bold text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{Math.round((item.value / 1200) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">User Acquisition</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Growth over time</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="farmers" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="buyers" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="experts" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">AI Intelligence Usage</h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">Model Requests</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiRequestData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#475569' }} width={80} />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Top Model</p>
                <p className="text-sm font-black text-gray-900 tracking-tight">Weather Intelligence</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">AI model requests have increased by <span className="text-green-600 font-black">24%</span> compared to last month.</p>
          </div>
        </div>
      </div>

      {/* Recent Alerts & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Alerts */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Critical Alerts</h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">3 Priority</span>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Server Load Peak', time: '10 mins ago', type: 'System', severity: 'High', icon: Activity },
              { title: 'Payment Gateway Timeout', time: '25 mins ago', type: 'Finance', severity: 'Critical', icon: DollarSign },
              { title: 'Failed Model Training', time: '1 hour ago', type: 'AI', severity: 'Medium', icon: Cpu },
              { title: 'Spam Activity Detected', time: '3 hours ago', type: 'Community', severity: 'Low', icon: Shield },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    alert.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                  )}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">{alert.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alert.type} • {alert.time}</p>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">System Health</h3>
          <div className="space-y-8">
            {[
              { label: 'Database Status', value: 'Healthy', percentage: 98, color: 'bg-green-500' },
              { label: 'Server Memory', value: '42% Used', percentage: 42, color: 'bg-blue-500' },
              { label: 'Cloudinary Storage', value: '1.2TB / 5TB', percentage: 24, color: 'bg-purple-500' },
              { label: 'API Response Time', value: '142ms', percentage: 15, color: 'bg-orange-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-600">{item.label}</p>
                  <p className="text-sm font-black text-gray-900 tracking-tight">{item.value}</p>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn("h-full rounded-full", item.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
