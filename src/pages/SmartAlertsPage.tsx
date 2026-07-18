import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Stethoscope, 
  Droplets, 
  Sprout, 
  ShoppingCart, 
  Building2, 
  ShieldAlert, 
  Eye, 
  X, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Filter,
  Search,
  MoreVertical,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Weather' | 'Disease' | 'Market' | 'Soil' | 'Gov' | 'Maintenance';
  suggestedAction: string;
  createdAt: string;
}

const icons: Record<string, any> = {
  Weather: CloudRain,
  Disease: Stethoscope,
  Soil: Droplets,
  Market: ShoppingCart,
  Gov: Building2,
  Maintenance: ShieldAlert
};

const priorities: Record<string, string> = {
  Critical: 'bg-red-500 text-white border-red-600 shadow-red-500/20',
  High: 'bg-orange-500 text-white border-orange-600 shadow-orange-500/20',
  Medium: 'bg-blue-500 text-white border-blue-600 shadow-blue-500/20',
  Low: 'bg-gray-500 text-white border-gray-600 shadow-gray-500/20'
};

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'AL-1', title: 'Flash Flood Warning', description: 'Heavy rainfall (>100mm) expected in your region tonight. Ensure proper drainage in fields.', priority: 'Critical', type: 'Weather', suggestedAction: 'Create temporary drainage channels immediately.', createdAt: new Date().toISOString() },
    { id: 'AL-2', title: 'Whitefly Outbreak', description: 'Nearby farms reported severe whitefly infestation. High risk for your cotton crop.', priority: 'High', type: 'Disease', suggestedAction: 'Apply organic neem oil spray (2ml/L) early morning.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'AL-3', title: 'Market Price Surge', description: 'Tomato prices in APMC Mandi increased by 15% today. Optimal time for harvest.', priority: 'Medium', type: 'Market', suggestedAction: 'Harvest mature crops and transport to mandi by tomorrow 4 AM.', createdAt: new Date(Date.now() - 7200000).toISOString() },
  ]);

  const [activeTab, setActiveTab] = useState<'All' | 'Critical' | 'Archived'>('All');

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Smart AI Alerts</h1>
          <p className="text-gray-500 font-medium">Real-time critical alerts with AI-powered suggested actions for your farm.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-red-100 animate-pulse">
            <AlertTriangle className="w-4 h-4" /> {alerts.filter(a => a.priority === 'Critical').length} Critical Alerts
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {['All', 'Critical', 'Archived'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {alerts.map((alert) => {
            const Icon = icons[alert.type] || AlertTriangle;
            return (
              <motion.div
                layout
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative p-8 rounded-[40px] border flex flex-col gap-6 shadow-xl transition-all hover:scale-[1.02] duration-500 group",
                  alert.priority === 'Critical' ? "bg-red-50 border-red-100" :
                  alert.priority === 'High' ? "bg-orange-50 border-orange-100" :
                  "bg-white border-gray-100"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500",
                    alert.priority === 'Critical' ? "bg-red-600 text-white" :
                    alert.priority === 'High' ? "bg-orange-600 text-white" :
                    "bg-blue-600 text-white"
                  )}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
                      priorities[alert.priority]
                    )}>
                      {alert.priority}
                    </span>
                    <button 
                      onClick={() => dismissAlert(alert.id)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Clock className="w-3 h-3" /> {new Date(alert.createdAt).toLocaleTimeString()}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{alert.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{alert.description}</p>
                </div>

                {/* AI Suggestion */}
                <div className="mt-auto p-6 bg-white/50 border border-white rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-600">
                    <Bot className="w-4 h-4" /> AI Suggested Action
                  </div>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed italic">
                    "{alert.suggestedAction}"
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button className="flex-grow px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 group/btn">
                      Perform Action <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all shadow-sm">
                      <Clock className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Info Card */}
      <div className="bg-blue-600 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="text-3xl font-black tracking-tight leading-tight">AgriSmart AI continuously monitors your farm's health.</h2>
          <p className="text-blue-100 font-medium text-lg">Our system combines real-time weather data, satellite imagery, and market trends to ensure you're always one step ahead.</p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
            Configure Alert Settings
          </button>
        </div>
        <div className="relative z-10 w-48 h-48 bg-blue-500 rounded-full flex items-center justify-center opacity-50 blur-3xl animate-pulse" />
        <Bot className="absolute -right-12 -bottom-12 w-64 h-64 text-blue-500 opacity-20 rotate-12" />
      </div>
    </div>
  );
}
