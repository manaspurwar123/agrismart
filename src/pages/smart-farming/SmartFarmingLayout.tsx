import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, Droplets, Map as MapIcon, QrCode, Wifi, 
  Settings, Bell, Search, Activity, ChevronRight, Menu, X, Plane, Package, Truck, PhoneCall, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function SmartFarmingLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: Activity, label: 'Dashboard', path: '/smart-farming/dashboard' },
    { icon: MapIcon, label: 'Farm GPS', path: '/smart-farming/gps' },
    { icon: QrCode, label: 'QR & Barcode', path: '/smart-farming/qr' },
    { icon: Wifi, label: 'IoT Sensors', path: '/smart-farming/iot' },
    { icon: Droplets, label: 'Smart Irrigation', path: '/smart-farming/irrigation' },
    { icon: Plane, label: 'Drones', path: '/smart-farming/drones' },
    { icon: Package, label: 'Warehouse', path: '/smart-farming/warehouse' },
    { icon: Truck, label: 'Route Planner', path: '/smart-farming/routes' },
    { icon: PhoneCall, label: 'Emergency', path: '/smart-farming/emergency' },
    { icon: Settings, label: 'Settings', path: '/smart-farming/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed lg:sticky top-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col shrink-0 overflow-hidden"
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50 shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group text-left"
            title="Go back to AgriSmart Home"
          >
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-700 transition-all shadow-md shadow-green-100">
              <ArrowLeft className="w-5 h-5 text-white transition-transform group-hover:-translate-x-1" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1">
                  SmartFarming
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-lg font-bold group-hover:bg-green-100 group-hover:text-green-700 transition-colors">&larr; Exit</span>
                </h1>
              </motion.div>
            )}
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 hover:bg-gray-50 rounded-xl"
          >
            <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", sidebarOpen && "rotate-180")} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && (
                <span className="font-bold whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Persistent Exit Button at Bottom */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/50 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl font-black text-sm transition-all border border-gray-100 shadow-sm hover:border-green-200 active:scale-95 group"
            title="Exit Smart Farming & Go to Main Platform"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
            {sidebarOpen && <span className="whitespace-nowrap">Exit Smart Farming</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-xl bg-gray-50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 transition-all w-96">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search smart farming..." 
                className="bg-transparent border-none outline-none w-full text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center relative hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>
              <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-green-600">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
