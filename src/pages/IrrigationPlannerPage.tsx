import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Droplets, 
  Calendar, 
  Clock, 
  Wind, 
  AlertTriangle,
  CheckCircle2,
  Download,
  Plus,
  RefreshCcw,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';
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
  Cell
} from 'recharts';

export const IrrigationPlannerPage: React.FC = () => {
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockFarms = [
        { id: '1', name: 'Green Valley Estate', crop: 'Wheat', size: 15 },
        { id: '2', name: 'Sunrise Orchards', crop: 'Grapes', size: 8 },
        { id: '3', name: 'Riverfront Fields', crop: 'Rice', size: 20 }
      ];
      setFarms(mockFarms as any);
      if (mockFarms.length > 0) setSelectedFarm(mockFarms[0].id);
    } catch (err) {
      console.error(err);
      setFarms([]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const farm = farms.find(f => f.id === selectedFarm);
      const res = await fetch('/api/irrigation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          farmId: selectedFarm,
          soilType: 'Loamy',
          crop: farm?.crop || 'Wheat'
        })
      });
      const data = await res.json();
      setSchedule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { day: 'Mon', usage: 45 },
    { day: 'Tue', usage: 52 },
    { day: 'Wed', usage: 48 },
    { day: 'Thu', usage: 61 },
    { day: 'Fri', usage: 55 },
    { day: 'Sat', usage: 67 },
    { day: 'Sun', usage: 58 }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Irrigation Planner</h1>
            <p className="text-gray-500">Smart water management powered by real-time soil & weather data</p>
          </div>
          <div className="flex gap-4">
            <select 
              className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm font-bold text-gray-700"
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
            >
              {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <Button 
              onClick={handleGenerate}
              disabled={loading || !selectedFarm}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2 px-8 py-6 rounded-[24px] text-lg shadow-lg shadow-green-100"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : <Zap className="w-6 h-6" />}
              Generate Plan
            </Button>
          </div>
        </div>

        {!schedule && !loading && (
          <div className="bg-white rounded-[48px] p-24 text-center border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Droplets className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No active schedule found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Click the button above to generate an AI-powered irrigation schedule based on your current farm conditions.</p>
          </div>
        )}

        {schedule && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Weekly Schedule */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black">Weekly Water Schedule</h3>
                  <Button variant="ghost" className="gap-2 text-blue-600 font-bold">
                    <Calendar className="w-4 h-4" /> Calendar View
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {Array.isArray(schedule.weeklySchedule) && schedule.weeklySchedule.map((day: any, i: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="group flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                          {String(day.day).substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-black text-lg text-gray-900">{day.amount}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day.advice}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          day.amount === 'None' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {day.amount === 'None' ? 'Rest' : 'Active'}
                        </div>
                        <CheckCircle2 className={`w-6 h-6 ${day.amount === 'None' ? 'text-gray-200' : 'text-blue-500'}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black mb-8">Water Usage Analytics</h3>
                <div className="h-[300px]">
                  {chartData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#999'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#999'}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="usage" radius={[10, 10, 10, 10]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 5 ? '#2E7D32' : '#60A5FA'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Droplets className="w-24 h-24" />
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10">Smart Summary</h3>
                <div className="space-y-6 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Today's Requirement</p>
                    <p className="text-3xl font-black">{schedule.dailyRequirement || '45 L/m²'}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest px-2">Key Insights</p>
                    {Array.isArray(schedule.tips) && schedule.tips.map((tip: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-8 bg-white text-blue-600 hover:bg-blue-50 font-black py-4 rounded-2xl">
                  Download PDF Report
                </Button>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Optimization Tips</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Clock />, title: "Best Time", desc: "Water between 4 AM - 7 AM" },
                    { icon: <Wind />, title: "Wind Alert", desc: "Avoid sprinkling if wind > 15km/h" },
                    { icon: <Info />, title: "Drip Check", desc: "Inspect emitters for clogs weekly" }
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#2E7D32] shadow-sm">
                        {tip.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{tip.title}</p>
                        <p className="text-xs text-gray-500">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
