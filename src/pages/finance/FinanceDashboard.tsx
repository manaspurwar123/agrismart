import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export const FinanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/reports/finance');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!stats || stats.error) return <div className="p-8 text-center"><h2 className="text-xl font-bold text-gray-900">Please log in to view your dashboard.</h2></div>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-4 block">Financial Intelligence</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Farm Wallet.</h1>
          <p className="text-xl text-gray-500 font-medium">Track your prosperity. Analyze every grain of income and expenditure.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/finance/expenses')}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
          <button 
            onClick={() => navigate('/finance/income')}
            className="px-8 py-4 bg-green-700 text-white rounded-2xl font-black shadow-xl hover:bg-green-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Income
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Income', value: stats.totalIncome, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+12.5%' },
          { label: 'Total Expenses', value: stats.totalExpense, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', trend: '+4.2%' },
          { label: 'Net Profit', value: stats.profit, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+18.1%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 min-h-[240px]">
            <div className="flex items-center justify-between">
              <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
              <span className={cn("px-4 py-2 rounded-xl text-xs font-black", stat.bg, stat.color)}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">{stat.label}</p>
              <h4 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">₹{(stat.value || 0).toLocaleString()}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Financial Trends</h3>
            <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
              {['1M', '6M', '1Y'].map(t => (
                <button key={t} className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all", t === '6M' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                  itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#15803d" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#b91c1c" strokeWidth={4} fill="none" strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Expense Split</h3>
          <div className="h-[300px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(stats.expensesByCategory).map(([name, value]) => ({ name, value }))}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {Object.entries(stats.expensesByCategory).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#15803d', '#1d4ed8', '#7c3aed', '#db2777', '#ea580c'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-hide">
            {Object.entries(stats.expensesByCategory).map(([name, value]: [any, any], i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#15803d', '#1d4ed8', '#7c3aed', '#db2777', '#ea580c'][i % 5] }} />
                  <span className="text-sm font-bold text-gray-600">{name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">₹{(value || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Expenses</h3>
            <button 
              onClick={() => navigate('/finance/expenses')}
              className="text-gray-400 font-bold hover:text-gray-900 flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { category: 'Seeds', amount: 4500, date: '2 hours ago', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
              { category: 'Fuel', amount: 1200, date: 'Yesterday', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
              { category: 'Labour', amount: 8000, date: '2 days ago', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px]">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", e.bg)}>
                    <e.icon className={cn("w-6 h-6", e.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{e.category}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{e.date}</p>
                  </div>
                </div>
                <span className="text-lg font-black text-red-600">- ₹{e.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Income</h3>
            <button 
              onClick={() => navigate('/finance/income')}
              className="text-gray-400 font-bold hover:text-gray-900 flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { category: 'Crop Sales', amount: 124500, date: 'Today', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { category: 'Rental Income', amount: 2500, date: '3 hours ago', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { category: 'Dairy', amount: 450, date: 'Morning', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px]">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", e.bg)}>
                    <e.icon className={cn("w-6 h-6", e.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{e.category}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{e.date}</p>
                  </div>
                </div>
                <span className="text-lg font-black text-green-600">+ ₹{e.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
