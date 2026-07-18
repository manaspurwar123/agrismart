import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  CalendarClock,
  ExternalLink,
  Map,
  Mic
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { EventItem } from '../../types';

export function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      if (res.ok) {
        // Refresh local state or show success
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Events Filter / Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">Events & Workshops</h1>
          <p className="text-sm font-medium text-gray-500">Upskill yourself with live training and networking events.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search events..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition-all"
            />
          </div>
          <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-700 shadow-sm transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Featured Event */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden flex flex-col xl:flex-row group"
        >
          <div className="xl:w-1/2 relative overflow-hidden">
            <img src={events[0].banner} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-8 left-8 flex gap-3">
              <span className="px-4 py-2 bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                Featured Event
              </span>
              <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-xl">
                {events[0].date.split('-')[0]}
              </span>
            </div>
          </div>
          <div className="xl:w-1/2 p-12 flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <CalendarClock className="w-4 h-4 text-green-600" />
                {new Date(events[0].date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="w-1 h-1 bg-gray-200 rounded-full" />
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-green-600" />
                {events[0].time}
              </div>
            </div>
            
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-6 leading-[0.9] group-hover:text-green-700 transition-colors">
              {events[0].title}
            </h2>
            <p className="text-lg font-medium text-gray-500 mb-8 leading-relaxed line-clamp-3">
              {events[0].description}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Speaker</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Mic className="text-green-700 w-4 h-4" />
                  </div>
                  <p className="text-sm font-black text-gray-900">{events[0].speaker}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Map className="text-blue-600 w-4 h-4" />
                  </div>
                  <p className="text-sm font-black text-gray-900">{events[0].location}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleRegister(events[0].id)}
                disabled={events[0].isRegistered}
                className={cn(
                  "flex-grow py-5 rounded-[24px] text-lg font-black tracking-tighter shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95",
                  events[0].isRegistered 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-green-700 text-white shadow-green-100 hover:bg-green-800"
                )}
              >
                {events[0].isRegistered ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Registered Successfully
                  </>
                ) : (
                  <>
                    Register for Event
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
              <button className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 hover:text-green-700 transition-all">
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="text-gray-900 font-black">{events[0].registeredCount}</span> / {events[0].maxParticipants} Farmers Registered
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Other Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.slice(1).map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
          >
            <div className="h-48 relative overflow-hidden shrink-0">
              <img src={event.banner} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-widest">
                {event.date}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-4 leading-tight group-hover:text-green-700 transition-colors">
                {event.title}
              </h3>
              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Users className="w-4 h-4 text-green-600" />
                  {event.registeredCount} Farmers Attending
                </div>
              </div>
              <button 
                onClick={() => handleRegister(event.id)}
                disabled={event.isRegistered}
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-black tracking-tighter transition-all flex items-center justify-center gap-2 active:scale-95",
                  event.isRegistered 
                    ? "bg-gray-50 text-gray-400" 
                    : "bg-green-700 text-white shadow-lg shadow-green-100 hover:bg-green-800"
                )}
              >
                {event.isRegistered ? 'Registered' : 'View & Join'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {isLoading && [1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[40px] border border-gray-100 p-8 space-y-6 animate-pulse">
            <div className="w-full h-48 bg-gray-100 rounded-3xl" />
            <div className="space-y-4">
              <div className="w-3/4 h-6 bg-gray-100 rounded-full" />
              <div className="w-full h-4 bg-gray-50 rounded-full" />
            </div>
          </div>
        ))}

        {/* Add Event Button (for experts/admin) */}
        {user?.role === 'expert' && (
          <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-8 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-black text-sm uppercase tracking-widest">Host a Workshop</p>
          </button>
        )}
      </div>
    </div>
  );
}
