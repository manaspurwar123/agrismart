import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Package, 
  Users, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Award,
  Globe
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
import { Button } from '../../components/ui/Button';

export const SalesAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/sales');
      const analytics = await res.json();
      setData(analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-[#F9FBFA]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  const PIE_DATA = [
    { name: 'Fruits', value: 400 },
    { name: 'Vegetables', value: 300 },
    { name: 'Grains', value: 300 },
    { name: 'Pulses', value: 200 }
  ];

  const COLORS = ['#4ADE80', '#60A5FA', '#FB923C', '#F472B6'];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Merchant Analytics</h1>
            <p className="text-gray-500 font-medium">Deep insights into your sales performance and revenue</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 border-gray-100 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">
              <Calendar className="w-4 h-4" /> Last 30 Days
            </Button>
            <Button className="gap-2 bg-gray-900 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">
              <Download className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Revenue', value: `₹${(data.totalSales || 0).toLocaleString()}`, change: '+12.5%', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Products', value: data.totalProducts, change: '+2', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Requests', value: data.activeRequests, change: '-4', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Merchant Level', value: 'Silver', change: 'Top 15%', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border-2 border-gray-100 shadow-sm relative overflow-hidden"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          {/* Sales Revenue Chart */}
          <div className="lg:col-span-8 bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Revenue Trends</h3>
              <div className="flex gap-2">
                {['Daily', 'Weekly', 'Monthly'].map(period => (
                  <button key={period} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === 'Monthly' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                    dy={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                    dx={-20}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                    itemStyle={{ fontWeight: 900, color: '#111827' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#4ADE80" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-4 bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-12 tracking-tight text-center">Sales By Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8">
              {PIE_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{((item.value / 1200) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Summary */}
        <div className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight text-center">Recent Transaction Activity</h3>
            <Button variant="outline" className="border-gray-100 rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px]">
              View All History
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Rahul Sharma', product: 'Premium Basmati', amount: '₹12,450', status: 'Completed', growth: '+15%' },
                  { name: 'Green Market Store', product: 'Organic Tomatoes', amount: '₹8,900', status: 'Completed', growth: '+22%' },
                  { name: 'Amit Singh', product: 'Fresh Mangoes', amount: '₹24,000', status: 'Pending', growth: '0%' },
                  { name: 'Local Kitchens', product: 'Spices Mix', amount: '₹4,200', status: 'Completed', growth: '+8%' }
                ].map((order, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.name}`} alt="User" />
                        </div>
                        <span className="font-black text-gray-900">{order.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-gray-500 uppercase">{order.product}</span>
                    </td>
                    <td className="px-6 py-6 font-black text-gray-900">{order.amount}</td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-xs font-black text-green-500">{order.growth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
