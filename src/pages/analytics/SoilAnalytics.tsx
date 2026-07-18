import React, { useEffect, useState } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Thermometer,
  ChevronRight,
  Target,
  Activity,
  Zap,
  Droplets,
  FlaskConical,
  Beaker
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line
} from 'recharts';

export default function SoilAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/soil')
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

  const soilKpis = [
    { label: "Soil Health Score", value: data.healthScore + "/100", trend: "Stable", icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
    { label: "NPK Balance", value: "Balanced", trend: "+2%", icon: FlaskConical, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "pH History", value: "6.5 Avg", trend: "Optimal", icon: Beaker, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Organic Matter", value: data.organicMatter + "%", trend: "+0.2%", icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  const nutrientData = [
    { subject: 'Nitrogen', A: data.npk.nitrogen, fullMark: 100 },
    { subject: 'Phosphorus', A: data.npk.phosphorus, fullMark: 100 },
    { subject: 'Potassium', A: data.npk.potassium, fullMark: 100 },
    { subject: 'Calcium', A: 45, fullMark: 100 },
    { subject: 'Magnesium', A: 32, fullMark: 100 },
    { subject: 'Sulfur', A: 28, fullMark: 100 },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Soil Analytics</h1>
          <p className="text-gray-500 font-medium">Sub-surface intelligence and nutrient balance optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            Order Lab Test
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            Update IoT Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {soilKpis.map((kpi, idx) => (
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
                kpi.trend === 'Optimal' || kpi.trend === 'Stable' || kpi.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
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
        {/* Nutrient Profile */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">Nutrient Composition Matrix</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={nutrientData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Current Levels"
                      dataKey="A"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.1}
                      strokeWidth={3}
                    />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* pH History */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
           <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10">pH History Analysis</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data.phHistory.map((ph: any, i: any) => ({ month: i + 1, ph }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                    <YAxis domain={[0, 14]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="step" dataKey="ph" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
