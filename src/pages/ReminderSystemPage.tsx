import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  List, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  Filter, 
  Search, 
  Droplets, 
  Sprout, 
  ShoppingCart, 
  Key, 
  Building2, 
  AlertCircle,
  MoreVertical,
  Flag,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  category: 'Irrigation' | 'Fertilizer' | 'Harvest' | 'Sowing' | 'Market' | 'Rental' | 'Insurance' | 'Gov' | 'Other';
  status: 'Pending' | 'Completed';
}

const categories: Record<string, any> = {
  Irrigation: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
  Fertilizer: { icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
  Harvest: { icon: Sprout, color: 'text-orange-600', bg: 'bg-orange-50' },
  Sowing: { icon: Sprout, color: 'text-purple-600', bg: 'bg-purple-50' },
  Market: { icon: ShoppingCart, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  Rental: { icon: Key, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Insurance: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  Gov: { icon: Building2, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  Other: { icon: Flag, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export default function ReminderSystemPage() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'REM-1', title: 'Irrigate Tomato Plot A', date: '2026-07-16', time: '06:00', category: 'Irrigation', status: 'Pending' },
    { id: 'REM-2', title: 'Apply Urea to Wheat', date: '2026-07-17', time: '08:00', category: 'Fertilizer', status: 'Pending' },
    { id: 'REM-3', title: 'Collect Rental Harvester', date: '2026-07-18', time: '09:00', category: 'Rental', status: 'Pending' },
    { id: 'REM-4', title: 'Visit Mandi for Rates', date: '2026-07-16', time: '04:00', category: 'Market', status: 'Completed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    time: '12:00'
  });

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Pending' ? 'Completed' : 'Pending' } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const reminder: Reminder = {
      id: `REM-${Math.random().toString(36).substr(2, 9)}`,
      title: newReminder.title!,
      category: newReminder.category as any,
      date: newReminder.date!,
      time: newReminder.time!,
      status: 'Pending'
    };
    setReminders(prev => [...prev, reminder]);
    setIsModalOpen(false);
    setNewReminder({ title: '', category: 'Other', date: new Date().toISOString().split('T')[0], time: '12:00' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Farmer's Reminder System</h1>
          <p className="text-gray-500 font-medium">Manage your daily tasks, irrigation schedules, and important deadlines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setView('calendar')}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-xl transition-all",
                view === 'calendar' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-xl transition-all",
                view === 'list' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Reminder
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: reminders.length, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: reminders.filter(r => r.status === 'Pending').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Completed', value: reminders.filter(r => r.status === 'Completed').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Today', value: reminders.filter(r => r.date === new Date().toISOString().split('T')[0]).length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Main Content */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        {view === 'list' ? (
          <div className="divide-y divide-gray-50">
            {reminders.sort((a, b) => b.date.localeCompare(a.date)).map((reminder) => {
              const cat = categories[reminder.category];
              const Icon = cat.icon;
              return (
                <div key={reminder.id} className="group p-8 hover:bg-gray-50/50 transition-all flex items-center gap-8">
                  <button 
                    onClick={() => toggleComplete(reminder.id)}
                    className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center transition-all",
                      reminder.status === 'Completed' 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "border-gray-200 text-gray-200 hover:border-green-600 hover:text-green-600"
                    )}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                    cat.bg, cat.color
                  )}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{reminder.category}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reminder.date} at {reminder.time}</span>
                    </div>
                    <h3 className={cn(
                      "text-xl font-black tracking-tight",
                      reminder.status === 'Completed' ? "text-gray-400 line-through" : "text-gray-900"
                    )}>
                      {reminder.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center py-32 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
              <Calendar className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Calendar View coming soon</h3>
            <p className="text-gray-500 font-medium">Switch to List View for now to manage your tasks.</p>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">New Reminder</h3>
            </div>
            <form onSubmit={handleAddReminder} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Irrigate field 4"
                  value={newReminder.title}
                  onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newReminder.date}
                    onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Time</label>
                  <input 
                    type="time" 
                    required
                    value={newReminder.time}
                    onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                <select 
                  value={newReminder.category}
                  onChange={e => setNewReminder({ ...newReminder, category: e.target.value as any })}
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                >
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow px-6 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
