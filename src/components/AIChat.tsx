import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Mic, User, Bot, Sparkles, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Namaste! I am your AgriSmart AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <Card className="w-[400px] h-[600px] flex flex-col p-0 overflow-hidden shadow-2xl border-none">
        <div className="bg-[#2E7D32] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">AgriSmart AI</h3>
              <p className="text-[10px] opacity-80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online Assistant
              </p>
            </div>
          </div>
          <button 
            onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold hover:bg-white/20 transition-all"
          >
            <Globe className="w-3 h-3" /> {language}
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? 'bg-[#2E7D32] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <button className="p-3 text-gray-400 hover:text-[#2E7D32] transition-colors bg-gray-50 rounded-xl">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text" placeholder={language === 'Hindi' ? 'अपना सवाल पूछें...' : 'Ask your question...'}
            className="flex-grow py-3 outline-none text-sm"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-[#2E7D32] text-white rounded-xl hover:shadow-lg hover:shadow-green-100 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-3xl p-6 shadow-xl border border-gray-100', className)}>
    {children}
  </div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
