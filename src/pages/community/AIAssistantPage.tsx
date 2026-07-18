import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Globe, 
  Sparkles, 
  MessageCircle,
  Clock,
  ChevronRight,
  MoreVertical,
  Volume2,
  Mic,
  Languages
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage } from '../../types';

export function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/ai/chat/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setMessages(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      text: input,
      sender: 'user',
      language,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          userId: 'ai',
          text: data.text,
          sender: 'ai',
          language,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const suggestions = [
    "What is the best fertilizer for wheat?",
    "How to prevent yellow rust in barley?",
    "Show me current market prices for rice.",
    "Tell me about PM Kisan scheme benefits."
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-250px)] flex gap-8">
      {/* Sidebar - History */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-black text-gray-900 tracking-tighter flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            Recent Chats
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {history.filter(m => m.sender === 'user').slice(-10).map((msg) => (
            <button 
              key={msg.id}
              className="w-full text-left p-3 rounded-2xl hover:bg-gray-50 transition-colors group relative"
            >
              <p className="text-xs font-bold text-gray-900 line-clamp-1 pr-6">{msg.text}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
          {history.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-gray-300 w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No history yet</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Current Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 relative">
              <Bot className="text-white w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter text-gray-900 leading-none mb-1">AgriSmart AI</h2>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Your Virtual Agriculture Expert</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {['English', 'Hindi', 'Punjabi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    language === lang ? "bg-white text-green-700 shadow-sm" : "text-gray-400 hover:text-gray-900"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
              <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center relative">
                <Sparkles className="text-green-600 w-12 h-12 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-700 rounded-2xl flex items-center justify-center">
                  <Bot className="text-white w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-gray-900 mb-2">Hello, {user?.name?.split(' ')[0] || 'Farmer'}!</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  How can I help you today? I can provide advice on crops, pest management, weather updates, and government schemes.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(s); }}
                    className="p-4 text-left rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 hover:bg-green-50 hover:border-green-100 transition-all flex items-center justify-between group"
                  >
                    {s}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4",
                  msg.sender === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.sender === 'user' ? "bg-green-100" : "bg-green-700"
                )}>
                  {msg.sender === 'user' ? (
                    user?.avatar ? <img src={user.avatar} alt="" /> : <User className="text-green-700 w-5 h-5" />
                  ) : (
                    <Bot className="text-white w-5 h-5" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[70%] p-5 rounded-3xl",
                  msg.sender === 'user' 
                    ? "bg-green-700 text-white rounded-tr-none shadow-lg shadow-green-100" 
                    : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
                )}>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={cn(
                    "mt-3 flex items-center gap-3 pt-3 border-t",
                    msg.sender === 'user' ? "border-white/10" : "border-gray-100"
                  )}>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest opacity-50",
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'ai' && (
                      <button className="text-gray-400 hover:text-green-700 transition-colors ml-auto">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none border border-gray-100">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-2 h-2 bg-green-700 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white rounded-2xl text-gray-400 hover:text-green-700 shadow-sm transition-all active:scale-95">
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask in ${language}...`}
                className="w-full pl-6 pr-14 py-4 bg-white rounded-2xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-green-500 transition-all outline-none border border-gray-100"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all active:scale-95",
                  input.trim() && !isLoading ? "bg-green-700 text-white shadow-lg" : "bg-gray-100 text-gray-300"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              Voice Support Available
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Languages className="w-3 h-3" />
              Multi-Language Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
