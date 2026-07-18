import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Eraser, 
  Download, 
  Copy, 
  RefreshCw, 
  MessageSquare,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  Mic,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'Text' | 'Voice';
  createdAt: string;
}

export default function AiAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/ai/history');
      if (res.ok) {
        const data = await res.json();
        const formatted = (Array.isArray(data) ? data : []).flatMap((d: any) => [
          { id: `${d.id}-user`, role: 'user' as const, content: d.message, type: 'Text' as const, createdAt: d.createdAt },
          { id: `${d.id}-ai`, role: 'assistant' as const, content: d.response, type: 'Text' as const, createdAt: d.createdAt }
        ]);
        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      type: 'Text' as const,
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
        const aiMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.text,
          type: 'Text' as const,
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

  const clearChat = async () => {
    if (confirm('Are you sure you want to clear your chat history?')) {
      try {
        // Here we'd ideally have a bulk delete, but let's just clear local for now
        // and assume backend history is kept for "Chat History" page
        setMessages([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const suggestedQuestions = [
    "Which crop should I grow in monsoon?",
    "Is my tomato crop healthy?",
    "How much urea for 1 acre wheat?",
    "Organic ways to kill whiteflies",
    "Current market price of Onion in Nashik"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            AgriSmart AI Assistant <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </h1>
          <p className="text-gray-500 font-medium">Your personalized AI companion for all farming needs.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setLanguage('English')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              language === 'English' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            )}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('Hindi')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              language === 'Hindi' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            )}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center">
                <Bot className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Namaste, {user?.name}!</h3>
                <p className="text-gray-500 font-medium">I am your AgriSmart AI. Ask me anything about your crops, weather, or market prices.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInput(q)}
                    className="p-4 bg-gray-50 hover:bg-green-50 text-gray-700 text-sm font-bold rounded-2xl text-left transition-all border border-transparent hover:border-green-100"
                  >
                    {q}
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
                  "flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-6 rounded-[28px] text-sm font-medium leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-50 text-blue-900 rounded-tr-none" 
                    : "bg-gray-50 text-gray-900 rounded-tl-none border border-gray-100"
                )}>
                  {msg.content}
                  <div className={cn(
                    "mt-3 pt-3 border-t flex items-center gap-4 text-[10px] font-black uppercase tracking-widest",
                    msg.role === 'user' ? "border-blue-100 text-blue-400" : "border-gray-100 text-gray-400"
                  )}>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 ml-auto">
                        <button className="hover:text-gray-600"><Copy className="w-3 h-3" /></button>
                        <button className="hover:text-gray-600"><RefreshCw className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-green-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-50 p-6 rounded-[28px] rounded-tl-none border border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button 
              onClick={clearChat}
              className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
              title="Clear Chat"
            >
              <Eraser className="w-5 h-5" />
            </button>
            <div className="flex-grow relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about crops, fertilizers, or prices..."
                className="w-full bg-white border border-gray-100 focus:border-green-500/30 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold transition-all outline-none shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all shadow-sm">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
