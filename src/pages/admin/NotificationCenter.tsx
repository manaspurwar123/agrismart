import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Send, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Plus, 
  History, 
  Eye, 
  MoreVertical, 
  Trash2,
  Users,
  AlertTriangle,
  Target,
  Megaphone,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const notifications = [
  { id: 'NOT-001', title: 'New Government Subsidy Available', type: 'Announcement', target: 'All Farmers', status: 'Sent', sentAt: '10 mins ago', reach: '4.5K' },
  { id: 'NOT-002', title: 'Weather Alert: Heavy Rainfall Expected', type: 'Emergency', target: 'Karnataka Region', status: 'Sending', sentAt: 'Just now', reach: '1.2K' },
  { id: 'NOT-003', title: 'Experts Verified: Weekly Round-up', type: 'Info', target: 'Experts', status: 'Scheduled', sentAt: 'In 2 hours', reach: '850' },
  { id: 'NOT-004', title: 'Platform Maintenance Notice', type: 'System', target: 'All Users', status: 'Sent', sentAt: 'Yesterday', reach: '12K' },
];

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'emails' | 'sms'>('notifications');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Notification & Email Center</h1>
          <p className="text-gray-500 font-medium">Broadcast messages, send system alerts, and manage automated email campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Compose Broadcast
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'notifications', label: 'Push Notifications', icon: Bell },
          { id: 'emails', label: 'Email Campaigns', icon: Mail },
          { id: 'sms', label: 'SMS Alerts', icon: Smartphone },
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
          { label: 'Total Sent (30d)', value: '145K', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Open Rate', value: '42.8%', icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Campaigns', value: '08', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Delivery Rate', value: '98.2%', icon: CheckCircle2, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Broadcasts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Broadcast Title & Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Audience</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reach & Analytics</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 tracking-tight mb-1">{notif.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                        notif.type === 'Emergency' ? "bg-red-50 text-red-600" :
                        notif.type === 'Announcement' ? "bg-blue-50 text-blue-600" :
                        "bg-gray-50 text-gray-500"
                      )}>
                        {notif.type}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notif.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> {notif.target}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-black text-gray-900">{notif.reach}</span>
                      </div>
                      <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                      notif.status === 'Sent' ? "text-green-600" : 
                      notif.status === 'Sending' ? "text-blue-600 animate-pulse" :
                      "text-orange-500"
                    )}>
                      {notif.status === 'Sent' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {notif.status}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{notif.sentAt}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
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
