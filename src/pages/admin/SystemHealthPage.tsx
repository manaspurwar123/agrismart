import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  Zap, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  History, 
  ChevronRight,
  Wifi,
  Mail,
  Cloud,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const healthData = [
  { time: '00:00', cpu: 25, memory: 40, responseTime: 120 },
  { time: '04:00', cpu: 15, memory: 35, responseTime: 110 },
  { time: '08:00', cpu: 65, memory: 60, responseTime: 240 },
  { time: '12:00', cpu: 82, memory: 75, responseTime: 320 },
  { time: '16:00', cpu: 55, memory: 55, responseTime: 180 },
  { time: '20:00', cpu: 35, memory: 45, responseTime: 140 },
  { time: '23:59', cpu: 20, memory: 38, responseTime: 115 },
];

export default function SystemHealthPage() {
  const [lastCheck, setLastCheck] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastCheck(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: 'Core Server (Node.js)', status: 'Online', uptime: '14 Days', latency: '12ms', icon: Server, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Database (MongoDB Atlas)', status: 'Online', uptime: '45 Days', latency: '45ms', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Storage (Cloudinary)', status: 'Online', uptime: '120 Days', latency: '210ms', icon: Cloud, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Email Service (SendGrid)', status: 'Online', uptime: '12 Days', latency: '1.2s', icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'AI Service (Gemini)', status: 'Online', uptime: '8 Days', latency: '420ms', icon: Zap, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Payment Gateway (Stripe)', status: 'Online', uptime: '32 Days', latency: '240ms', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">System Health & Infrastructure</h1>
          <p className="text-gray-500 font-medium">Real-time monitoring of servers, databases, third-party APIs, and storage.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">Last Check: {lastCheck}</span>
          </div>
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Run Diagnostics
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'CPU Usage', value: '32%', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50', status: 'Healthy' },
          { label: 'RAM Usage', value: '4.2GB / 8GB', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', status: 'Optimal' },
          { label: 'Disk Space', value: '1.2TB Free', icon: HardDrive, color: 'text-orange-600', bg: 'bg-orange-50', status: 'Safe' },
          { label: 'Network In/Out', value: '2.4 GB/s', icon: Wifi, color: 'text-green-600', bg: 'bg-green-50', status: 'Active' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{stat.status}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Usage Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Resource Consumption</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                   itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}
                   labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={4} fillOpacity={0.1} fill="#8b5cf6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Latency Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Global API Latency</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                   itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}
                   labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Services Status Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">External Service Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Service Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Uptime</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Response Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", service.bg)}>
                        <service.icon className={cn("w-5 h-5", service.color)} />
                      </div>
                      <p className="font-black text-gray-900 tracking-tight">{service.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600">
                      <CheckCircle2 className="w-4 h-4" /> {service.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-600">{service.uptime}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-900 tracking-tight">{service.latency}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all" title="View Logs">
                      <History className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
