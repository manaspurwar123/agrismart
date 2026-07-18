import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Star, 
  Trophy, 
  Calendar, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const communityNav = [
  { name: 'Community Hub', path: '/community', icon: LayoutDashboard },
  { name: 'Discussion Feed', path: '/community/feed', icon: Users },
  { name: 'Ask Expert', path: '/community/expert', icon: MessageSquare },
  { name: 'Learning Hub', path: '/community/learning', icon: BookOpen },
  { name: 'Video Library', path: '/community/videos', icon: Video },
  { name: 'AI Assistant', path: '/community/ai-chat', icon: MessageCircle },
  { name: 'Expert Profiles', path: '/community/experts', icon: Star },
  { name: 'Success Stories', path: '/community/stories', icon: Trophy },
  { name: 'Events & Workshops', path: '/community/events', icon: Calendar },
];

export function CommunityLayout() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-24">
      {/* Community Header */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between py-4 overflow-x-auto no-scrollbar gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
                <Users className="text-white w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tighter leading-none mb-1">Farmer Hub</h1>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Connect & Learn</p>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              {communityNav.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/community'}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                    isActive 
                      ? "bg-green-700 text-white shadow-lg shadow-green-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search community..."
                  className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium w-64 focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
