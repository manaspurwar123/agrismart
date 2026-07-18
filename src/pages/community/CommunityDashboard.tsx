import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Star, 
  Trophy, 
  Video, 
  BookOpen, 
  ArrowRight, 
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  Play
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function CommunityDashboard() {
  const [stats, setStats] = useState({
    activeFarmers: '12.5k+',
    totalQuestions: '45k+',
    expertsOnline: '24',
    communities: '150+'
  });

  const featuredCourses = [
    {
      id: '1',
      title: 'Hydroponics Masterclass',
      instructor: 'Dr. Sunita Sharma',
      rating: 4.9,
      students: '1.2k',
      thumbnail: 'https://images.unsplash.com/photo-1558449197-27a192848395?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '2',
      title: 'Organic Pest Management',
      instructor: 'Prof. Rajesh Kumar',
      rating: 4.8,
      students: '2.5k',
      thumbnail: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const trendingDiscussions = [
    {
      id: '1',
      author: 'Amit Singh',
      role: 'Farmer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
      title: 'Best time for Sowing Wheat in Northern India?',
      content: 'I am planning to start sowing next week. Any advice on the variety and fertilizer ratio?',
      likes: 24,
      comments: 15,
      time: '2h ago'
    },
    {
      id: '2',
      author: 'Priya Verma',
      role: 'Expert',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
      title: 'Combating Yellow Rust in Barley',
      content: 'Early signs are visible in some districts. Here is a guide to preventive sprays.',
      likes: 56,
      comments: 8,
      time: '5h ago'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Farmers', value: stats.activeFarmers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Questions Resolved', value: stats.totalQuestions, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Experts Online', value: stats.expertsOnline, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Live Communities', value: stats.communities, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Discussion Feed */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-600" />
              Trending Discussions
            </h2>
            <NavLink to="/community/feed" className="text-sm font-bold text-green-700 hover:gap-2 flex items-center gap-1 transition-all">
              View All Feed <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="space-y-4">
            {trendingDiscussions.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-none">{post.author}</h4>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">{post.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <Clock className="w-3 h-3" />
                    {post.time}
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{post.title}</h3>
                <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="ml-auto text-gray-400 hover:text-amber-500 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Featured Courses */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-900 tracking-tighter">Top Courses</h3>
              <NavLink to="/community/learning" className="text-xs font-bold text-green-700">Explore</NavLink>
            </div>
            <div className="space-y-4">
              {featuredCourses.map((course) => (
                <div key={course.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="text-white w-6 h-6 fill-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-tight mb-1 group-hover:text-green-700 transition-colors">{course.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-1">{course.instructor}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-gray-900">{course.rating}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">({course.students} students)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Ask */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-3xl text-white shadow-xl shadow-green-100">
            <MessageCircle className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-black tracking-tighter mb-2">Need Instant Help?</h3>
            <p className="text-sm text-green-50/80 font-medium mb-6">Ask our AI Expert anything about crops, pests, or market prices.</p>
            <NavLink 
              to="/community/ai-chat" 
              className="w-full py-3 bg-white text-green-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
            >
              Ask AgriSmart AI
            </NavLink>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 tracking-tighter mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {[
                { title: "National Farmers' Expo", date: "Oct 15", time: "10 AM", type: "Virtual" },
                { title: "Drip Irrigation Webinar", date: "Oct 18", time: "3 PM", type: "Live" }
              ].map((event, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-900">
                    <span className="text-[10px] font-black uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                    <span className="text-lg font-black leading-none">{event.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-tight mb-1">{event.title}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-black text-green-700 uppercase tracking-widest">
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <NavLink to="/community/events" className="w-full py-3 mt-6 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              View Calendar
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
