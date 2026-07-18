import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Lock, 
  Key, 
  UserX, 
  AlertTriangle, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Eye, 
  CheckCircle2,
  MoreVertical,
  History,
  Terminal,
  Server,
  Fingerprint,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const loginHistory = [
  { id: 'LOG-001', user: 'Admin Rajesh', action: 'Login Success', ip: '192.168.1.1', location: 'Delhi, IN', device: 'Chrome / Windows', time: '2 mins ago' },
  { id: 'LOG-002', user: 'Expert Amit', action: 'Login Success', ip: '192.168.1.45', location: 'Mumbai, IN', device: 'Safari / iPhone', time: '12 mins ago' },
  { id: 'LOG-003', user: 'Unknown', action: 'Failed Login', ip: '45.12.34.128', location: 'Moscow, RU', device: 'Firefox / Linux', time: '45 mins ago', suspicious: true },
  { id: 'LOG-004', user: 'Farmer Suresh', action: 'Login Success', ip: '192.168.1.12', location: 'Pune, IN', device: 'Chrome / Android', time: '1 hour ago' },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'sessions' | 'blocked' | 'permissions'>('logs');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Security & Access</h1>
          <p className="text-gray-500 font-medium">Monitor login attempts, manage active sessions, and configure role-based permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Global Lockdown
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'logs', label: 'Login History', icon: History },
          { id: 'sessions', label: 'Active Sessions', icon: Activity },
          { id: 'blocked', label: 'Blocked IPs', icon: UserX },
          { id: 'permissions', label: 'Roles & Permissions', icon: ShieldCheck },
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Security Score', value: '94/100', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Admins', value: '04', icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Failed Logins (24h)', value: '12', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Blocked Attacks', value: '1,458', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Login History Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search security logs..." 
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User & Action</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">IP Address</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location & Device</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loginHistory.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        log.suspicious ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                      )}>
                        {log.suspicious ? <AlertTriangle className="w-5 h-5" /> : <Fingerprint className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 tracking-tight">{log.user}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.action}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-mono text-gray-600">{log.ip}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-700 text-xs">{log.location}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.device}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Clock className="w-3 h-3" /> {log.time}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {log.suspicious ? (
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm">
                        Block IP
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4" /> Secure
                      </div>
                    )}
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
