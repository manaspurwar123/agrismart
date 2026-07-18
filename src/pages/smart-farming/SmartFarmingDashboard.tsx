import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Droplets, MapPin, Search, Wind, Sun, Battery } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const soilData = [
  { time: '00:00', moisture: 45, ph: 6.8 },
  { time: '04:00', moisture: 42, ph: 6.8 },
  { time: '08:00', moisture: 38, ph: 6.7 },
  { time: '12:00', moisture: 35, ph: 6.7 },
  { time: '16:00', moisture: 40, ph: 6.8 },
  { time: '20:00', moisture: 46, ph: 6.9 },
];

export function SmartFarmingDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Command Center</h1>
          <p className="text-gray-500 font-medium">Real-time overview of your farming operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-50 rounded-xl flex items-center gap-2 border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-green-700">All Systems Nominal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Farm Health', value: '92%', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Soil Moisture', value: '45%', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Drones', value: '3/4', icon: Battery, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Avg Temp', value: '24°C', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-gray-500 font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Soil Moisture & pH</h2>
            <select className="bg-gray-50 border-none text-sm font-bold rounded-xl px-4 py-2">
              <option>Today</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilData}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI Recommendations</h2>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-900">Irrigation Alert</h3>
              </div>
              <p className="text-sm text-green-800">Moisture dropping in North Sector. Start drip irrigation for 45 mins.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-orange-900">Heat Warning</h3>
              </div>
              <p className="text-sm text-orange-800">Temperature expected to peak at 35°C today. Deploy shade nets if possible.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Drone Survey</h3>
              </div>
              <p className="text-sm text-blue-800">Scheduled drone survey for crop health analysis at 14:00.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
