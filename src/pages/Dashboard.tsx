import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  MapPin, 
  ShoppingBag, 
  Bell, 
  Plus, 
  Minus,
  MessageSquare,
  Users,
  BookOpen,
  Thermometer,
  Droplets,
  Wind,
  Stethoscope,
  History,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { MyFarmsPage } from './MyFarmsPage';
import { FinanceDashboard } from './finance/FinanceDashboard';
import SmartAlertsPage from './SmartAlertsPage';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'fields' | 'finance' | 'alerts'>('overview');
  const [stats, setStats] = useState({
    farmCount: 0,
    avgSoilHealth: 0,
    nextIrrigation: 'Checking...',
    activeAlerts: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      setStats({
        farmCount: 3,
        avgSoilHealth: 85,
        nextIrrigation: 'Tomorrow 06:00 AM',
        activeAlerts: 2
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-[1600px] mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <span className="text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-4 block">Agricultural Command Center</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Hello, {user?.name?.split(' ')[0]}.</h1>
          <div className="flex items-center gap-2 text-gray-500 font-bold">
            <MapPin className="w-4 h-4" />
            <span>{user?.state || 'Punjab'}, {user?.district || 'Northern District'} • Verified Farm</span>
          </div>
        </div>
        
        <div className="flex gap-2 p-2 bg-gray-100 rounded-[24px] w-fit">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'fields', icon: Sprout, label: 'My Fields' },
            { id: 'finance', icon: TrendingUp, label: 'Finance' },
            { id: 'alerts', icon: Bell, label: 'Alerts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300",
                activeTab === tab.id ? "bg-white text-green-700 shadow-xl" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* Stats Row */}
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Active Farms', value: stats.farmCount, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Avg Soil Health', value: `${stats.avgSoilHealth}%`, icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Next Irrigation', value: stats.nextIrrigation, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Active Alerts', value: stats.activeAlerts, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-lg font-black text-gray-900 leading-none">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Stats */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[48px] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-3xl font-black mb-2 relative z-10">Optimal Sowing Window</h2>
                <p className="text-green-300 font-bold mb-8 relative z-10">Conditions are Perfect (94% Accuracy)</p>
                <div className="flex items-end gap-3 relative z-10">
                  <span className="text-6xl font-black">24°C</span>
                  <div className="flex flex-col mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Soil Temp</span>
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-2xl shadow-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-8">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Weather Dashboard', icon: Wind, color: 'bg-blue-100 text-blue-700', path: '/weather' },
                    { label: 'Farm Map', icon: MapPin, color: 'bg-green-100 text-green-700', path: '/farm-map' },
                    { label: 'Soil Analysis', icon: Sprout, color: 'bg-amber-100 text-amber-700', path: '/soil-analysis' },
                    { label: 'Irrigation Planner', icon: Droplets, color: 'bg-cyan-100 text-cyan-700', path: '/irrigation-planner' },
                    { label: 'Crop Recommendation', icon: Sprout, color: 'bg-green-100 text-green-700', path: '/crop-recommendation' },
                    { label: 'Disease Detection', icon: Stethoscope, color: 'bg-red-100 text-red-700', path: '/disease-detection' },
                    { label: 'Weather Alerts', icon: Bell, color: 'bg-orange-100 text-orange-700', path: '/weather-alerts' },
                    { label: 'Marketplace', icon: ShoppingBag, color: 'bg-purple-100 text-purple-700', path: '/marketplace' },
                    { label: 'Farmer Community', icon: Users, color: 'bg-green-100 text-green-700', path: '/community' },
                    { label: 'Expert Help', icon: MessageSquare, color: 'bg-amber-100 text-amber-700', path: '/community/expert' },
                    { label: 'Learning Hub', icon: BookOpen, color: 'bg-blue-100 text-blue-700', path: '/community/learning' },
                  ].map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => navigate(action.path)}
                      className="flex flex-col items-center gap-3 p-6 rounded-3xl hover:bg-gray-50 transition-colors group text-center"
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", action.color)}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[48px] p-10 shadow-2xl shadow-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-8">Field Weather</h3>
              <div className="space-y-6">
                {[
                  { label: 'Humidity', value: '65%', icon: Droplets, color: 'text-blue-500' },
                  { label: 'Wind Speed', value: '12km/h', icon: Wind, color: 'text-gray-500' },
                  { label: 'Precipitation', value: '15%', icon: Droplets, color: 'text-green-500' },
                ].map((w, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
                    <div className="flex items-center gap-4">
                      <w.icon className={cn("w-5 h-5", w.color)} />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{w.label}</span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{w.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'fields' && <MyFarmsPage />}
        {activeTab === 'finance' && <FinanceDashboard />}
        {activeTab === 'alerts' && <SmartAlertsPage />}
      </AnimatePresence>
    </div>
  );
}
