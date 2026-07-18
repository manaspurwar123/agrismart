import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Clock, AlertTriangle, Power, Leaf, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SmartIrrigation() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/irrigation/logs');
      let data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Find latest action to set state
        data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setIsIrrigating(data[0].action === 'START');
      }
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIrrigation = async () => {
    const endpoint = isIrrigating ? '/api/irrigation/stop' : '/api/irrigation/start';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: 'North Sector', duration, source: 'Manual' })
      });
      if (res.ok) {
        setIsIrrigating(!isIrrigating);
        fetchLogs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const waterUsageData = [
    { day: 'Mon', usage: 1200 },
    { day: 'Tue', usage: 1100 },
    { day: 'Wed', usage: 1400 },
    { day: 'Thu', usage: 900 },
    { day: 'Fri', usage: 1500 },
    { day: 'Sat', usage: 1300 },
    { day: 'Sun', usage: 1600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Smart Irrigation</h1>
          <p className="text-gray-500 font-medium">Control water delivery and monitor usage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-3xl border transition-colors ${
              isIrrigating ? 'bg-blue-600 border-blue-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-xl font-bold ${isIrrigating ? 'text-white' : 'text-gray-900'}`}>Master Control</h2>
              <div className={`p-2 rounded-xl ${isIrrigating ? 'bg-blue-500/50' : 'bg-gray-50'}`}>
                <Droplets className={`w-6 h-6 ${isIrrigating ? 'text-white animate-pulse' : 'text-blue-500'}`} />
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={toggleIrrigation}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-xl transition-all ${
                  isIrrigating 
                    ? 'bg-white text-blue-600 shadow-blue-900/20 active:scale-95' 
                    : 'bg-blue-50 text-blue-600 shadow-blue-100/50 hover:bg-blue-100 active:scale-95'
                }`}
              >
                <Power className="w-10 h-10" />
                <span className="font-black tracking-widest uppercase">{isIrrigating ? 'STOP' : 'START'}</span>
              </button>
            </div>

            <div className={`p-4 rounded-2xl ${isIrrigating ? 'bg-blue-700/50 text-blue-50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Timer Duration</span>
                <span className="text-sm font-bold">{duration} min</span>
              </div>
              <input 
                type="range" 
                min="10" max="120" step="10" 
                value={duration} 
                onChange={(e) => setDuration(parseInt(e.target.value))}
                disabled={isIrrigating}
                className="w-full accent-blue-500 disabled:opacity-50" 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-500 w-5 h-5" /> AI Recommendations
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-800 font-medium">Skip tomorrow's morning cycle. 60% chance of rain predicted.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm text-green-800 font-medium">Soil moisture in Sector B is optimal. No action needed.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 h-96"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Water Usage (Liters)</h2>
              <select className="bg-gray-50 border-none text-sm font-bold rounded-xl px-4 py-2">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterUsageData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Logs</h2>
            <div className="space-y-4">
              {logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${log.action === 'START' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                      {log.action === 'START' ? <Droplets className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{log.action === 'START' ? 'Irrigation Started' : 'Irrigation Stopped'}</p>
                      <p className="text-xs text-gray-500 font-medium">Zone: {log.zone} | Source: {log.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-center text-gray-500 py-4">No irrigation logs yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
