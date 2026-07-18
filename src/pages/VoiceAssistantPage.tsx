import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Command, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  History,
  CloudRain,
  ShoppingCart,
  LayoutDashboard,
  Bell,
  Stethoscope,
  Building2,
  CalendarDays,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState<{ cmd: string; time: string } | null>(null);

  const commands = [
    { name: 'Open Weather', icon: CloudRain, route: '/weather' },
    { name: 'Open Marketplace', icon: ShoppingCart, route: '/marketplace' },
    { name: 'Open Dashboard', icon: LayoutDashboard, route: '/' },
    { name: 'Show Notifications', icon: Bell, route: '/notifications' },
    { name: 'Check Crop Health', icon: Stethoscope, route: '/ai/disease-detection' },
    { name: 'Show Government Schemes', icon: Building2, route: '/schemes' },
    { name: 'Show Today\'s Tasks', icon: CalendarDays, route: '/reminders' },
  ];

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate voice to text conversion
      processTranscript("Open Marketplace");
    } else {
      setIsListening(true);
      setTranscript("Listening...");
      setAiReply("");
    }
  };

  const processTranscript = async (text: string) => {
    setTranscript(text);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: 'English' })
      });

      if (res.ok) {
        const data = await res.json();
        setAiReply(data.text);
        setLastCommand({ cmd: text, time: new Date().toLocaleTimeString() });

        // Auto-navigation based on command keywords
        const lowerText = text.toLowerCase();
        if (lowerText.includes('marketplace') || lowerText.includes('mandi')) navigate('/marketplace');
        else if (lowerText.includes('weather')) navigate('/weather');
        else if (lowerText.includes('dashboard')) navigate('/');
        else if (lowerText.includes('notification')) navigate('/notifications');
        else if (lowerText.includes('scheme')) navigate('/schemes');
        else if (lowerText.includes('task') || lowerText.includes('reminder')) navigate('/reminders');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-widest border border-green-100/50">
          <Volume2 className="w-3.5 h-3.5" /> Voice Mode Active
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">AgriSmart Voice Assistant</h1>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">Control your farm and the platform with just your voice. Fast, hands-free, and intelligent.</p>
      </div>

      {/* Main Interaction Area */}
      <div className="relative h-[450px] bg-white rounded-[50px] border border-gray-100 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0, 0.1],
                    borderRadius: ["40%", "50%", "40%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute w-64 h-64 bg-green-500/20"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center p-8">
          {/* Transcript / Reply Display */}
          <div className="min-h-[100px] space-y-4">
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div 
                  key="transcript"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-black text-gray-900 tracking-tight max-w-lg"
                >
                  "{transcript}"
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {aiReply && (
                <motion.div 
                  key="reply"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-bold text-green-600 tracking-tight max-w-md"
                >
                  {aiReply}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Voice Pulse / Button */}
          <button 
            onClick={handleToggleMic}
            className={cn(
              "w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 shadow-xl",
              isListening ? "bg-red-500 text-white scale-110" : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isListening ? (
              <Square className="w-10 h-10 fill-white" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {isListening ? "Listening to your command..." : "Tap the mic to start speaking"}
          </p>
        </div>
      </div>

      {/* Commands Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 tracking-tight text-center">Try These Commands</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {commands.map((cmd, idx) => (
            <button 
              key={idx}
              onClick={() => processTranscript(cmd.name)}
              className="group p-4 bg-white rounded-3xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all text-center space-y-3 shadow-sm hover:shadow-lg hover:shadow-green-600/5"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-600 group-hover:text-white transition-all">
                <cmd.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-tight">{cmd.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent History */}
      {lastCommand && (
        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Command</p>
              <p className="text-sm font-black text-gray-900">"{lastCommand.cmd}"</p>
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lastCommand.time}</p>
        </div>
      )}
    </div>
  );
}
