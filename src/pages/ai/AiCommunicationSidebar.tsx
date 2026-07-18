import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  Bell, 
  AlertTriangle, 
  Mail, 
  Calendar, 
  Zap, 
  History,
  LayoutDashboard,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AiCommunicationSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { section: 'AI Assistants', items: [
      { name: 'AI Assistant', path: '/ai/assistant', icon: Bot },
      { name: 'Voice Assistant', path: '/voice-assistant', icon: Mic },
      { name: 'Chat History', path: '/ai/history', icon: History },
    ]},
    { section: 'Notifications & Alerts', items: [
      { name: 'Notification Center', path: '/notifications', icon: Bell },
      { name: 'Smart Alerts', path: '/alerts', icon: AlertTriangle },
    ]},
    { section: 'Smart Communication', items: [
      { name: 'Email Center', path: '/emails', icon: Mail },
      { name: 'Reminders', path: '/reminders', icon: Calendar },
      { name: 'AI Suggestions', path: '/ai/suggestions', icon: Zap },
    ]}
  ];

  return (
    <aside className="w-80 shrink-0 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto pr-6 hidden xl:block scrollbar-hide">
      <div className="space-y-10">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive 
                      ? "bg-green-700 text-white shadow-xl shadow-green-100" 
                      : "text-gray-500 hover:bg-white hover:text-gray-900 shadow-sm shadow-transparent hover:shadow-gray-100"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                    location.pathname === item.path ? "text-white" : "text-gray-400"
                  )} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Status Card */}
      <div className="mt-12 bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <p className="text-[10px] font-black uppercase tracking-widest text-green-400">AI Core Online</p>
        </div>
        <p className="text-sm font-bold leading-relaxed mb-6 opacity-70">"I've analyzed your farm data. You have 3 new suggestions to improve yield."</p>
        <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-50 transition-all">
          View Analysis
        </button>
      </div>
    </aside>
  );
};
