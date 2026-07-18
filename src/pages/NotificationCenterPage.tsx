import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CloudRain, 
  Stethoscope, 
  Droplets, 
  Sprout, 
  ShoppingCart, 
  Key, 
  Building2, 
  MessageCircle, 
  Sparkles, 
  Megaphone,
  CheckCircle2,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  ChevronRight,
  Clock,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Weather' | 'Disease' | 'Irrigation' | 'Fertilizer' | 'Harvest' | 'Market' | 'Rental' | 'Gov' | 'Community' | 'AI' | 'Admin';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

const icons: Record<string, any> = {
  Weather: CloudRain,
  Disease: Stethoscope,
  Irrigation: Droplets,
  Fertilizer: Sprout,
  Harvest: Sprout,
  Market: ShoppingCart,
  Rental: Key,
  Gov: Building2,
  Community: MessageCircle,
  AI: Sparkles,
  Admin: Megaphone
};

const colors: Record<string, string> = {
  Weather: 'bg-blue-50 text-blue-600',
  Disease: 'bg-red-50 text-red-600',
  Irrigation: 'bg-cyan-50 text-cyan-600',
  Fertilizer: 'bg-green-50 text-green-600',
  Market: 'bg-orange-50 text-orange-600',
  Rental: 'bg-purple-50 text-purple-600',
  Gov: 'bg-indigo-50 text-indigo-600',
  Community: 'bg-pink-50 text-pink-600',
  AI: 'bg-yellow-50 text-yellow-600',
  Admin: 'bg-gray-50 text-gray-600'
};

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Critical'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => markAsRead(n.id)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Critical') return n.priority === 'Critical' || n.priority === 'High';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Notification Center</h1>
          <p className="text-gray-500 font-medium">Stay updated with weather, alerts, and platform announcements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllRead}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
          {['All', 'Unread', 'Critical'].map((tab) => (
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
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            className="w-full bg-white border border-gray-100 focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 bg-white rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">No notifications found</h3>
              <p className="text-gray-500 font-medium">You're all caught up! Check back later.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((notif) => {
              const Icon = icons[notif.type] || Bell;
              return (
                <motion.div
                  layout
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "group relative bg-white p-6 rounded-[32px] border border-gray-100 hover:border-green-200 transition-all flex items-start gap-6 shadow-sm hover:shadow-lg hover:shadow-green-600/5",
                    !notif.isRead && "bg-blue-50/20 border-blue-100"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500",
                    colors[notif.type] || 'bg-gray-50 text-gray-600'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{notif.type}</span>
                        {notif.priority === 'Critical' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse">Critical</span>
                        )}
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">{notif.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">{notif.message}</p>
                    
                    {notif.link && (
                      <button className="mt-4 flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors">
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                        title="Mark as Read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
