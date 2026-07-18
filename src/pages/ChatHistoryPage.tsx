import React, { useState, useEffect } from 'react';
import { 
  History, 
  MessageSquare, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  ChevronRight, 
  Calendar, 
  Sparkles,
  Bot,
  User,
  Clock,
  MoreVertical,
  ArrowRight,
  Languages,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface ChatEntry {
  id: string;
  userId: string;
  message: string;
  response: string;
  language: string;
  category: string;
  createdAt: string;
}

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatEntry | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/ai/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">AI Conversation History</h1>
          <p className="text-gray-500 font-medium">Access all your previous interactions with AgriSmart AI Assistant.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Conversations', value: history.length, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Languages Used', value: '02', icon: Languages, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Accuracy', value: '98%', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-50' },
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
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
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
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Question</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Response Snippet</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center animate-pulse">Loading history...</td></tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
                      <History className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">No conversations yet</h3>
                    <p className="text-gray-500 font-medium">Start a chat with our AI to see your history here.</p>
                    <button 
                      onClick={() => navigate('/ai/assistant')}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg"
                    >
                      Start Chat Now
                    </button>
                  </td>
                </tr>
              ) : (
                history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((chat) => (
                  <tr key={chat.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 block">{new Date(chat.createdAt).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1 max-w-xs">{chat.message}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-gray-500 line-clamp-1 max-w-xs">{chat.response}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">{chat.category}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setSelectedChat(chat)}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                          title="View Conversation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate('/ai/assistant')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm"
                          title="Continue Chat"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteHistory(chat.id)}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat View Modal */}
      <AnimatePresence>
        {selectedChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Conversation Detail</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date(selectedChat.createdAt).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                {/* User Message */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="bg-blue-50 p-6 rounded-[28px] rounded-tl-none border border-blue-100 flex-grow">
                    <p className="text-sm font-bold text-blue-900 leading-relaxed">{selectedChat.message}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[28px] rounded-tl-none border border-gray-100 flex-grow">
                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{selectedChat.response}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => navigate('/ai/assistant')}
                  className="flex-grow px-6 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  Continue Conversation <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="px-8 py-4 bg-white border border-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
