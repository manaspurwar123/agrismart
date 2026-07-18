import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  Heart, 
  Share2, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  Plus,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Ban,
  MessageCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const posts = [
  { id: 'POST-001', author: 'Rajesh Pawar', content: 'My organic tomato crop is blooming! Drip irrigation made a difference.', likes: 124, comments: 12, reports: 0, status: 'Active', category: 'Success Story' },
  { id: 'POST-002', author: 'Unknown User', content: 'Buy these illegal pesticides at 50% discount. Call now!', likes: 2, comments: 0, reports: 15, status: 'Flagged', category: 'Spam' },
  { id: 'POST-003', author: 'Amit Singh', content: 'How to manage whitefly in cotton during monsoon?', likes: 45, comments: 28, reports: 0, status: 'Active', category: 'Question' },
];

export default function CommunityManagement() {
  const [activeTab, setActiveTab] = useState<'posts' | 'groups' | 'experts' | 'moderation'>('posts');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Community Management</h1>
          <p className="text-gray-500 font-medium">Moderate community posts, manage expert verified status, and handle flagged content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'posts', label: 'Posts', icon: FileText },
          { id: 'groups', label: 'Farmer Groups', icon: Users },
          { id: 'moderation', label: 'Moderation Queue', icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Daily Posts', value: '458', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Groups', value: '124', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pending Flags', value: '15', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
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

      {/* Posts Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search posts or authors..." 
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Author & Content</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Engagement</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 tracking-tight mb-1">{post.author}</p>
                    <p className="text-sm font-medium text-gray-500 line-clamp-1 max-w-xs">{post.content}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-blue-500" /> {post.comments}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">{post.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                      post.status === 'Active' ? "text-green-600" : "text-red-600"
                    )}>
                      {post.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {post.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
