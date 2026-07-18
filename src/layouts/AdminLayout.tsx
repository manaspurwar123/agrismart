import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Truck, 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  BarChart3, 
  FileText, 
  Cpu, 
  Globe, 
  Database, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  UserCircle,
  MessageSquare,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
  Zap,
  Lock,
  History,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const sidebarItems = [
  { group: 'Overview', items: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Reports', icon: FileText, path: '/admin/reports' },
  ]},
  { group: 'Platform Management', items: [
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Marketplace', icon: ShoppingBag, path: '/admin/marketplace' },
    { name: 'Rental', icon: Truck, path: '/admin/rental' },
    { name: 'Gov Schemes', icon: Globe, path: '/admin/government' },
    { name: 'Community', icon: MessageSquare, path: '/admin/community' },
    { name: 'AI Models', icon: Cpu, path: '/admin/ai' },
  ]},
  { group: 'Communication', items: [
    { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { name: 'Email Center', icon: Mail, path: '/admin/emails' },
    { name: 'Support', icon: HelpCircle, path: '/admin/support' },
    { name: 'Feedback', icon: Zap, path: '/admin/feedback' },
  ]},
  { group: 'Content', items: [
    { name: 'CMS', icon: FileCode, path: '/admin/cms' },
    { name: 'Media Library', icon: ImageIcon, path: '/admin/media' },
  ]},
  { group: 'System', items: [
    { name: 'Security', icon: Shield, path: '/admin/security' },
    { name: 'Database', icon: Database, path: '/admin/database' },
    { name: 'Logs', icon: History, path: '/admin/logs' },
    { name: 'System Health', icon: Activity, path: '/admin/health' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ]},
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-gray-900 font-sans selection:bg-green-600 selection:text-white">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-xl tracking-tighter whitespace-nowrap">AgriSmart <span className="text-green-600">Admin</span></span>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-grow overflow-y-auto px-4 py-6 custom-scrollbar">
          {sidebarItems.map((group, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{group.group}</h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                      isActive 
                        ? "bg-green-50 text-green-700" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isSidebarOpen ? "" : "mx-auto")} />
                    {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100]">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all",
              isSidebarOpen ? "" : "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "pl-72" : "pl-20"
      )}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-80 bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none mb-1">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-black overflow-hidden border border-green-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-grow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
