import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CloudRain, 
  Droplets, 
  Sprout, 
  ShoppingCart, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  ExternalLink,
  Zap,
  ChevronRight,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Weather' | 'Soil' | 'Crop' | 'Market' | 'Irrigation' | 'General';
  actionLabel?: string;
  actionLink?: string;
  createdAt: string;
}

const icons: Record<string, any> = {
  Weather: CloudRain,
  Soil: Droplets,
  Crop: Sprout,
  Market: ShoppingCart,
  Irrigation: Droplets,
  General: Sparkles
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-50 text-red-600 border-red-100',
  Medium: 'bg-orange-50 text-orange-600 border-orange-100',
  Low: 'bg-blue-50 text-blue-600 border-blue-100'
};

export default function AiSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: 'SUG-1', title: 'Rain expected tomorrow, delay irrigation', description: 'Forecast shows 80% chance of heavy rain tomorrow. Skipping irrigation today will save water and prevent root rot.', priority: 'High', category: 'Weather', actionLabel: 'View Detailed Forecast', createdAt: new Date().toISOString() },
    { id: 'SUG-2', title: 'Tomato prices are rising, consider selling', description: 'Prices in your nearest mandi have increased by 15% in the last 48 hours. Market indicators suggest this is the peak.', priority: 'Medium', category: 'Market', actionLabel: 'Check Mandi Rates', createdAt: new Date().toISOString() },
    { id: 'SUG-3', title: 'Soil nitrogen is low, apply fertilizer', description: 'Based on your last soil report, nitrogen levels are below optimal. Apply 20kg/acre of Urea within 3 days.', priority: 'High', category: 'Soil', actionLabel: 'View Soil Report', createdAt: new Date().toISOString() },
    { id: 'SUG-4', title: 'Optimal time for Seed Sowing', description: 'Soil moisture and temperature are perfect for sowing cotton seeds this week.', priority: 'Low', category: 'Crop', actionLabel: 'Buy Seeds', createdAt: new Date().toISOString() },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshSuggestions = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
            Smart AI Suggestions <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </h1>
          <p className="text-gray-500 font-medium">Personalized, data-driven advice generated specifically for your farm.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshSuggestions}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Regenerate Advice
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-green-600 p-10 rounded-[40px] text-white relative overflow-hidden group">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/30">
            <TrendingUp className="w-3.5 h-3.5" /> Productivity Boost
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-tight">Your Farm is performing 15% better than last month.</h2>
          <p className="text-green-100 font-medium text-lg leading-relaxed">AgriSmart AI has identified 3 new opportunities to increase your yield and reduce irrigation costs by optimizing fertilizer application.</p>
        </div>
        <Bot className="absolute -right-12 -bottom-12 w-64 h-64 text-green-500 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
        <div className="absolute top-0 right-0 p-8">
          <Sparkles className="w-12 h-12 text-yellow-400 opacity-50 animate-pulse" />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Top Recommendations</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Real-time Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {suggestions.map((sug) => {
              const Icon = icons[sug.category] || Sparkles;
              return (
                <motion.div
                  layout
                  key={sug.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-white p-8 rounded-[40px] border border-gray-100 hover:border-green-200 transition-all flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-green-600/5"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                      sug.category === 'Weather' ? "bg-blue-50 text-blue-600" :
                      sug.category === 'Market' ? "bg-orange-50 text-orange-600" :
                      "bg-green-50 text-green-600"
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      priorityColors[sug.priority]
                    )}>
                      {sug.priority} Priority
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-green-600 transition-colors">{sug.title}</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">{sug.description}</p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest hover:text-green-600 transition-all group/btn">
                      {sug.actionLabel || 'Take Action'} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      <Zap className="w-3 h-3" /> Just Now
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 p-10 rounded-[40px] text-white space-y-6 relative overflow-hidden">
          <h3 className="text-3xl font-black tracking-tight leading-tight">Personalized Farm Outlook</h3>
          <p className="text-gray-400 font-medium text-lg leading-relaxed">Based on your activity, we recommend diversifying your crop portfolio by adding pulses in the next cycle to restore soil health naturally.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expected Yield Increase</p>
              <h4 className="text-3xl font-black text-green-400 tracking-tight">+22%</h4>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cost Reduction</p>
              <h4 className="text-3xl font-black text-blue-400 tracking-tight">-12%</h4>
            </div>
          </div>
          <Bot className="absolute -right-8 -top-8 w-48 h-48 text-white opacity-5" />
        </div>
        
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-center space-y-6 text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-[32px] flex items-center justify-center mx-auto text-yellow-500">
            <Sparkles className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">AI Insights</h3>
            <p className="text-gray-500 font-medium mt-2">Our AI models are processing your data to find new ways to optimize your farm.</p>
          </div>
          <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
