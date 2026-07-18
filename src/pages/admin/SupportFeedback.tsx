import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  MessageSquare, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  ShieldCheck, 
  Zap, 
  Send,
  Flag,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const tickets = [
  { id: 'TKT-1024', user: 'Rajesh Kumar', subject: 'Payment Failed but Amount Deducted', priority: 'High', status: 'Open', category: 'Finance', date: '2024-03-15' },
  { id: 'TKT-1025', user: 'Amit Singh', subject: 'Crop Disease Prediction Accuracy Issue', priority: 'Medium', status: 'Pending', category: 'AI Support', date: '2024-03-14' },
  { id: 'TKT-1026', user: 'Suresh Patil', subject: 'How to register as an expert?', priority: 'Low', status: 'Resolved', category: 'Onboarding', date: '2024-03-12' },
  { id: 'TKT-1027', user: 'Anita Devi', subject: 'Refund for Machinery Booking', priority: 'Urgent', status: 'Open', category: 'Rental', date: '2024-03-16' },
];

const feedbackData = [
  { id: 'FB-001', user: 'Vikram Rao', rating: 5, category: 'General', comment: 'Excellent platform, very easy to use for farmers.', date: '2024-03-15' },
  { id: 'FB-002', user: 'Meena Sharma', rating: 3, category: 'Bug Report', comment: 'Marketplace filter is not working properly on mobile.', date: '2024-03-14' },
  { id: 'FB-003', user: 'Rahul Verma', rating: 4, category: 'Suggestion', comment: 'Would love to see more local languages supported.', date: '2024-03-12' },
];

export default function SupportFeedback() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'feedback'>('tickets');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Support & Feedback</h1>
          <p className="text-gray-500 font-medium">Manage customer support tickets, expert consultations, and user feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Ticket
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'tickets', label: 'Support Tickets', icon: HelpCircle },
          { id: 'feedback', label: 'User Feedback', icon: Zap },
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Open Tickets', value: '42', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Resolved (7d)', value: '158', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Urgent Priority', value: '08', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Avg Rating', value: '4.8/5', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none">
              <option>Status: All</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
            <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          {activeTab === 'tickets' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ticket ID & User</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject & Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Priority</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight mb-1">{ticket.id}</p>
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> {ticket.user}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-700 mb-1">{ticket.subject}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ticket.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        ticket.priority === 'Urgent' ? "bg-red-100 text-red-600" :
                        ticket.priority === 'High' ? "bg-orange-100 text-orange-600" :
                        ticket.priority === 'Medium' ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-500"
                      )}>
                        {ticket.priority}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                        ticket.status === 'Resolved' ? "text-green-600" : 
                        ticket.status === 'Pending' ? "text-orange-500" :
                        "text-blue-600"
                      )}>
                        {ticket.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {ticket.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User & ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Rating & Comment</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {feedbackData.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight mb-1">{feedback.user}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{feedback.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Zap key={i} className={cn("w-3 h-3", i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200")} />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-600 max-w-xs line-clamp-2">{feedback.comment}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">{feedback.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-gray-400">
                        {new Date(feedback.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm ml-auto">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing last entries</p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
