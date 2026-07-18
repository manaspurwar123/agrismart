import React from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Sprout, 
  ShieldCheck, 
  LineChart, 
  CloudRain, 
  Bot, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AI_FEATURES = [
  {
    id: 'crop-recommendation',
    title: 'Crop Recommendation Engine',
    description: 'Deep learning models that analyze soil health, NPK values, and climate data to suggest the most profitable crops for your specific farm.',
    icon: Sprout,
    color: 'bg-green-100 text-green-700',
    path: '/crop-recommendation',
    stats: '94% Accuracy'
  },
  {
    id: 'disease-detection',
    title: 'Computer Vision Disease Detection',
    description: 'Upload photos of your crops to instantly identify diseases, pests, and nutrient deficiencies. Get immediate treatment plans.',
    icon: ShieldCheck,
    color: 'bg-red-100 text-red-700',
    path: '/disease-detection',
    stats: 'Detects 50+ Diseases'
  },
  {
    id: 'yield-prediction',
    title: 'Predictive Yield Analytics',
    description: 'Forecast your harvest yields months in advance using satellite imagery, historical data, and real-time weather patterns.',
    icon: LineChart,
    color: 'bg-indigo-100 text-indigo-700',
    path: '/analytics/yield-prediction',
    stats: 'Data-driven forecasting'
  },
  {
    id: 'ai-assistant',
    title: 'Conversational AI Agronomist',
    description: 'Talk to our LLM-powered farming assistant in your local language. Ask questions about pest control, market rates, or government schemes.',
    icon: Bot,
    color: 'bg-purple-100 text-purple-700',
    path: '/ai/assistant',
    stats: '24/7 Expert Advice'
  },
  {
    id: 'weather-intelligence',
    title: 'Hyperlocal Weather AI',
    description: 'Machine learning models that predict micro-climate changes on your farm, automatically triggering irrigation or frost alerts.',
    icon: CloudRain,
    color: 'bg-blue-100 text-blue-700',
    path: '/weather',
    stats: 'Real-time Alerts'
  },
  {
    id: 'market-insights',
    title: 'Market Price Prediction',
    description: 'AI algorithms analyze global supply chains and local mandi prices to advise you on the best time to sell your harvest.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700',
    path: '/analytics/market',
    stats: 'Maximize Profits'
  }
];

export default function AiSolutionsPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 bg-[#FDFCF8] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 font-bold text-sm uppercase tracking-widest mb-8"
          >
            <Brain className="w-4 h-4" /> Powered by Advanced AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 relative z-10"
          >
            Intelligence.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-indigo-600">
              Redefined.
            </span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed relative z-10">
            Harness the power of machine learning, computer vision, and predictive analytics to transform your farm into a highly efficient, data-driven operation.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {AI_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(feature.path)}
              className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <feature.icon className="w-32 h-32 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
              </div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  {feature.stats}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 relative z-10">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed flex-grow relative z-10">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-sm font-bold text-gray-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors relative z-10">
                Launch Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture/Tech Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[60px] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm uppercase tracking-widest mb-8 border border-white/20">
              <Zap className="w-4 h-4 text-amber-400" /> Proprietary Engine
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
              Built on the AgriSmart Neural Core.
            </h2>
            <p className="text-xl text-gray-400 font-medium mb-10 leading-relaxed">
              Our models are trained on millions of data points from farms worldwide, localized to your specific region, soil type, and climate. All processed securely in real-time.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-2xl"
            >
              Experience the AI
            </button>
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-md">
              <div className="space-y-6">
                {[
                  { label: "Data Processing Speed", value: "< 100ms latency" },
                  { label: "Model Accuracy", value: "94.8% Field Tested" },
                  { label: "Supported Languages", value: "24 Regional Dialects" },
                  { label: "Data Points Analyzed", value: "2.5 Billion / Day" }
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">{stat.label}</span>
                    <span className="text-white font-black text-xl">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
