import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  History, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ChevronRight, 
  Zap, 
  BarChart3, 
  RefreshCw,
  MoreVertical,
  PlayCircle,
  StopCircle,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
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

const modelStats = [
  { name: 'Crop Recommendation', version: 'v2.4.0', status: 'Online', accuracy: '98.2%', latency: '240ms', usage: '1.2M' },
  { name: 'Disease Detection', version: 'v3.1.2', status: 'Online', accuracy: '95.8%', latency: '420ms', usage: '850K' },
  { name: 'Soil Analysis', version: 'v1.8.5', status: 'Online', accuracy: '92.4%', latency: '180ms', usage: '450K' },
  { name: 'Weather Prediction', version: 'v4.0.1', status: 'Online', accuracy: '89.7%', latency: '120ms', usage: '2.4M' },
];

const performanceData = [
  { time: '00:00', load: 45, latency: 120 },
  { time: '04:00', load: 30, latency: 110 },
  { time: '08:00', load: 85, latency: 280 },
  { time: '12:00', load: 92, latency: 340 },
  { time: '16:00', load: 78, latency: 260 },
  { time: '20:00', load: 60, latency: 180 },
  { time: '23:59', load: 50, latency: 140 },
];

export default function AiManagement() {
  const [activeTab, setActiveTab] = useState<'models' | 'logs' | 'accuracy'>('models');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">AI Intelligence Management</h1>
          <p className="text-gray-500 font-medium">Monitor and manage agricultural AI models, training logs, and prediction accuracy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retrain Models
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'models', label: 'Models', icon: Cpu },
          { id: 'logs', label: 'Prediction Logs', icon: FileText },
          { id: 'accuracy', label: 'Accuracy Reports', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: '4.9M', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Avg Accuracy', value: '94.2%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Latency', value: '240ms', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Model Failures', value: '12', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Real-time Performance</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Load vs Latency</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}
                labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
              />
              <Area type="monotone" dataKey="load" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
              <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLat)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Management Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Models</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Model Name & Version</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Accuracy</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Usage (Total)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modelStats.map((model, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 tracking-tight">{model.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{model.version}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600">
                      <CheckCircle2 className="w-4 h-4" /> {model.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-gray-900 tracking-tight">{model.accuracy}</span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: model.accuracy }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Zap className="w-4 h-4 text-yellow-500" /> {model.usage}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all" title="View Logs">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-green-600 hover:shadow-lg transition-all" title="Start Training">
                        <PlayCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-red-600 hover:shadow-lg transition-all" title="Stop Instance">
                        <StopCircle className="w-4 h-4" />
                      </button>
                    </div>
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
