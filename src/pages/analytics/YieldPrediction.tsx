import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sprout, 
  Target, 
  Droplets,
  Calendar,
  Zap,
  AlertTriangle,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { PredictionResult } from '../../types/analytics';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';

export default function YieldPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    soil: 'Loamy',
    weather: 'Sunny',
    irrigation: 'Drip',
    fertilizer: 'NPK 19-19-19'
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prediction/yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">AI Yield Prediction</h1>
          <p className="text-gray-500 font-medium">Predict harvest outcomes using Gemini-powered agricultural intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Input Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-10">
             <div className="p-3 bg-indigo-50 rounded-2xl">
                <Target className="w-6 h-6 text-indigo-600" />
             </div>
             <h3 className="text-xl font-black text-gray-900 tracking-tight">Predictive Parameters</h3>
          </div>
          
          <div className="space-y-8">
            {[
              { label: 'Select Crop', key: 'crop', options: ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane'] },
              { label: 'Soil Type', key: 'soil', options: ['Loamy', 'Sandy', 'Clay', 'Black', 'Red'] },
              { label: 'Weather Forecast', key: 'weather', options: ['Sunny', 'Rainy', 'Cloudy', 'Dry', 'Moderate'] },
              { label: 'Irrigation Type', key: 'irrigation', options: ['Drip', 'Sprinkler', 'Flood', 'Rain-fed'] },
            ].map((field, i) => (
              <div key={i} className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{field.label}</label>
                <select 
                  value={(formData as any)[field.key]}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                >
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
              ) : (
                <>Generate AI Prediction <TrendingUp className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Results / Content */}
        <div className="xl:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-indigo-50 rounded-[40px] p-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-indigo-200"
              >
                <div className="w-24 h-24 bg-indigo-100 rounded-[32px] flex items-center justify-center mb-8">
                  <Zap className="w-10 h-10 text-indigo-400 fill-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-indigo-900 tracking-tight mb-4 uppercase tracking-tighter">Ready for Intelligence</h3>
                <p className="text-indigo-400 font-bold max-w-sm">Enter your farm parameters on the left to generate high-fidelity harvest predictions powered by Gemini AI.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Result Hero */}
                <div className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Audit: Completed</span>
                      </div>
                      <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                        Expected Yield: <span className="text-indigo-600">{result.expectedYield} Tons</span>
                      </h2>
                      <p className="text-gray-400 font-medium leading-relaxed">
                        Predicted for <span className="text-gray-900 font-bold">{formData.crop}</span> in <span className="text-gray-900 font-bold">{formData.soil}</span> soil with a confidence score of <span className="text-indigo-600 font-black">{result.confidenceScore}%</span>.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                        <div className="px-6 py-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                           <Clock className="w-5 h-5 text-amber-500" />
                           <div className="text-left">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Harvest Estimate</p>
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{result.harvestEstimate || "Oct 2026"}</p>
                           </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                           <AlertTriangle className={cn("w-5 h-5", result.riskLevel === 'Low' ? 'text-green-500' : 'text-rose-500')} />
                           <div className="text-left">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Risk Assessment</p>
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{result.riskLevel} Risk</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                       <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                       <h4 className="text-xl font-black text-gray-900 tracking-tight">AI Optimization Tips</h4>
                    </div>
                    <div className="space-y-4">
                      {result.suggestions?.map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                           <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5" />
                           <p className="text-sm font-bold text-gray-700 leading-relaxed uppercase tracking-tighter">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Yield Probability Matrix</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Low', val: 15 }, { name: 'Avg', val: 35 },
                          { name: 'Predicted', val: 75 }, { name: 'High', val: 20 }
                        ]}>
                           <Bar dataKey="val" radius={[10, 10, 0, 0]}>
                              {[ '#f8fafc', '#f1f5f9', '#4f46e5', '#f1f5f9' ].map((c, i) => <Cell key={i} fill={c} />)}
                           </Bar>
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                           <Tooltip cursor={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* History Row */}
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 overflow-x-auto">
                   <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Prediction History</h4>
                   <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Crop</th>
                          <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Yield</th>
                          <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Confidence</th>
                          <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[1, 2, 3].map((_, i) => (
                          <tr key={i} className="group hover:bg-gray-50 transition-all">
                            <td className="py-6 font-bold text-gray-400 text-sm uppercase tracking-tighter">Oct 12, 2024</td>
                            <td className="py-6 font-black text-gray-900 text-sm uppercase tracking-tighter">{formData.crop}</td>
                            <td className="py-6 font-black text-indigo-600 text-sm uppercase tracking-tighter">24.5 Tons</td>
                            <td className="py-6 font-black text-gray-900 text-sm uppercase tracking-tighter">92%</td>
                            <td className="py-6">
                              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Low</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
