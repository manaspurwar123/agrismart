import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Trash2,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AppNotification } from '../../types';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'system'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/read', { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'order': return <ShoppingBag className="w-6 h-6 text-blue-600" />;
      case 'review': return <Star className="w-6 h-6 text-orange-600" />;
      case 'inquiry': return <MessageSquare className="w-6 h-6 text-purple-600" />;
      case 'alert': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <Bell className="w-6 h-6 text-green-600" />;
    }
  };

  const filtered = notifications.filter(n => {
    const type = (n.type || '').toLowerCase();
    if (filter === 'unread') return !n.isRead;
    if (filter === 'orders') return type === 'order';
    if (filter === 'system') return type === 'system' || type === 'alert';
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Notifications</h1>
            <p className="text-gray-500 font-medium">Stay updated with your marketplace activity</p>
          </div>
          <Button 
            onClick={markAllRead}
            variant="outline"
            className="gap-2 border-gray-100 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs"
          >
            <Check className="w-4 h-4" /> Mark All Read
          </Button>
        </div>

        {/* Filters */}
        <div className="flex bg-white border-2 border-gray-100 rounded-2xl p-1 mb-8 shadow-sm">
          {['all', 'unread', 'orders', 'system'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs ${filter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] h-24 animate-pulse border-2 border-gray-100" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <motion.div 
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`bg-white rounded-[32px] p-8 border-2 transition-all flex items-start gap-6 group relative ${n.isRead ? 'border-gray-100 opacity-60' : 'border-green-500 shadow-xl shadow-green-50'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50' : 'bg-green-50'}`}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-lg font-black text-gray-900 truncate pr-12 ${n.isRead ? '' : 'text-green-900'}`}>{n.title}</h4>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed">{n.message}</p>
                  </div>

                  {!n.isRead && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="absolute top-8 right-8 w-8 h-8 bg-green-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-[60px] p-24 text-center border-2 border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200">
              <Bell className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Inbox is clean</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">We'll notify you here when there's new activity in your store or purchases.</p>
            <Button onClick={() => navigate('/marketplace')} className="bg-gray-900 text-white rounded-2xl px-12 py-4">Explore Marketplace</Button>
          </div>
        )}
      </div>
    </div>
  );
};
