import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Thermometer, Droplets, Wind, Sun, Battery, Activity, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function IoTSensors() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock real-time data connection
  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 5000); // Poll every 5s for demo
    return () => clearInterval(interval);
  }, []);

  const fetchSensors = async () => {
    try {
      const res = await fetch('/api/iot/sensors');
      let data = await res.json();
      
      // If empty, generate some initial sensors
      if (!Array.isArray(data) || data.length === 0) {
         const initial = [
           { id: 'SEN-001', type: 'Soil Moisture', value: 42, unit: '%', status: 'online', battery: 85, location: 'North Field' },
           { id: 'SEN-002', type: 'Temperature', value: 24.5, unit: '°C', status: 'online', battery: 92, location: 'Greenhouse A' },
           { id: 'SEN-003', type: 'Humidity', value: 65, unit: '%', status: 'online', battery: 78, location: 'Greenhouse A' },
           { id: 'SEN-004', type: 'pH Sensor', value: 6.8, unit: 'pH', status: 'warning', battery: 15, location: 'South Field' },
         ];
         // Post them
         await Promise.all(initial.map(s => fetch('/api/iot/sensors', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(s)})));
         data = initial;
      }
      
      // Add slight random variations for live effect
      const liveData = (Array.isArray(data) ? data : []).map((s: any) => ({
         ...s,
         value: typeof s.value === 'number' ? (s.value + (Math.random() * 0.4 - 0.2)).toFixed(1) : s.value
      }));
      setSensors(liveData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('Moisture') || type.includes('Water') || type.includes('Rain')) return <Droplets className="w-6 h-6 text-blue-500" />;
    if (type.includes('Temp')) return <Thermometer className="w-6 h-6 text-orange-500" />;
    if (type.includes('Wind')) return <Wind className="w-6 h-6 text-gray-500" />;
    if (type.includes('Light') || type.includes('Sun')) return <Sun className="w-6 h-6 text-yellow-500" />;
    return <Activity className="w-6 h-6 text-green-500" />;
  };

  const mockHistoryData = [
    { time: '08:00', temp: 22, moisture: 40 },
    { time: '10:00', temp: 25, moisture: 38 },
    { time: '12:00', temp: 28, moisture: 35 },
    { time: '14:00', temp: 30, moisture: 32 },
    { time: '16:00', temp: 27, moisture: 36 },
    { time: '18:00', temp: 24, moisture: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">IoT Sensor Network</h1>
          <p className="text-gray-500 font-medium">Real-time telemetry from deployed farm sensors.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensors.map((sensor) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                {getIcon(sensor.type)}
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                sensor.status === 'online' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                {sensor.status.toUpperCase()}
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-500 mb-1">{sensor.type}</p>
            <div className="flex items-baseline gap-1 mb-4">
              <h3 className="text-3xl font-black text-gray-900">{sensor.value}</h3>
              <span className="text-gray-500 font-bold">{sensor.unit}</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <Battery className={`w-3.5 h-3.5 ${sensor.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                {sensor.battery}%
              </div>
              <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                {sensor.location}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Telemetry History</h2>
          <select className="bg-gray-50 border-none text-sm font-bold rounded-xl px-4 py-2">
            <option>Today</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
