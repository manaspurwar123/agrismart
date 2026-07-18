import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
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
  BarChart3,
  Wallet,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { PredictionResult } from '../../types/analytics';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function ProfitPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    estimatedYield: 50,
    marketPrice: 2100,
    labourCost: 45000,
    equipmentCost: 20000,
    fertilizerCost: 15000,
    transportationCost: 8000
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prediction/profit', {
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
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Financial Prediction Engine</h1>
          <p className="text-gray-500 font-medium">Predict revenue, profit margins and ROI with AI accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Input Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-10">
             <div className="p-3 bg-green-50 rounded-2xl">
                <Wallet className="w-6 h-6 text-green-600" />
             </div>
             <h3 className="text-xl font-black text-gray-900 tracking-tight">Venture Parameters</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Select Crop</label>
              <select 
                value={formData.crop}
                onChange={(e) => setFormData({...formData, crop: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              >
                {['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {[
              { label: 'Estimated Yield (Tons)', key: 'estimatedYield', type: 'number' },
              { label: 'Market Price (Per Ton)', key: 'marketPrice', type: 'number' },
              { label: 'Labour Costs ($)', key: 'labourCost', type: 'number' },
              { label: 'Fertilizer & Pesticides ($)', key: 'fertilizerCost', type: 'number' },
              { label: 'Equipment & Fuel ($)', key: 'equipmentCost', type: 'number' },
            ].map((field, i) => (
              <div key={i} className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{field.label}</label>
                <input 
                  type={field.type}
                  value={(formData as any)[field.key]}
                  onChange={(e) => setFormData({...formData, [field.key]: Number(e.target.value)})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>
            ))}

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full mt-6 py-5 bg-green-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
              ) : (
                <>Analyze Financial ROI <TrendingUp className="w-4 h-4" /></>
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
                className="bg-green-50 rounded-[40px] p-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-green-200"
              >
                <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center mb-8">
                  <DollarSign className="w-10 h-10 text-green-400 fill-green-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-green-900 tracking-tight mb-4 uppercase tracking-tighter">Financial Audit Ready</h3>
                <p className="text-green-400 font-bold max-w-sm">Simulate your agricultural venture's profitability using state-of-the-art AI analysis.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Result Hero */}
                <div className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ROI Analysis: 1.8x Estimated</span>
                      </div>
                      <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                        Profit Estimate: <span className="text-green-600">{result.estimatedProfit}</span>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                        {[
                           { label: "Expected Revenue", val: result.expectedRevenue, color: "text-indigo-600" },
                           { label: "Break-even", val: result.breakEvenPoint, color: "text-gray-900" },
                           { label: "Net Margin", val: result.profitMargin, color: "text-green-600" },
                           { label: "Risk Factor", val: result.riskLevel, color: result.riskLevel === 'Low' ? 'text-green-600' : 'text-rose-600' },
                        ].map((item, i) => (
                           <div key={i} className="space-y-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                              <p className={cn("text-lg font-black uppercase tracking-tighter leading-none", item.color)}>{item.val}</p>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Expense Breakdown */}
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Cost Allocation Matrix</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                             data={[
                               { name: 'Labour', val: formData.labourCost },
                               { name: 'Equipment', val: formData.equipmentCost },
                               { name: 'Fertilizer', val: formData.fertilizerCost },
                               { name: 'Transport', val: formData.transportationCost },
                             ]}
                             innerRadius={70}
                             outerRadius={100}
                             paddingAngle={8}
                             dataKey="val"
                           >
                              {[ '#4f46e5', '#10b981', '#f59e0b', '#ef4444' ].map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                       {[
                         { name: 'Labour', color: 'bg-indigo-600' },
                         { name: 'Equipment', color: 'bg-emerald-500' },
                         { name: 'Supplies', color: 'bg-amber-500' },
                         { name: 'Logistics', color: 'bg-rose-500' },
                       ].map((c, i) => (
                         <div key={i} className="flex items-center gap-2">
                           <div className={cn("w-3 h-3 rounded-full", c.color)} />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{c.name}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Profit Curve */}
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Profit Trend Simulation</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Month 1', profit: 0 }, { name: 'Month 2', profit: -2000 },
                          { name: 'Month 3', profit: 5000 }, { name: 'Month 4', profit: 15000 },
                          { name: 'Month 5', profit: 28000 }, { name: 'Month 6', profit: 45000 },
                        ]}>
                           <defs>
                             <linearGradient id="profitCurve" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                           <Tooltip />
                           <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fill="url(#profitCurve)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900 rounded-[40px] p-12 text-white flex items-center justify-between">
                   <div className="space-y-3">
                      <h4 className="text-2xl font-black tracking-tight uppercase tracking-tighter">Maximize Your Return</h4>
                      <p className="text-indigo-300 font-bold max-w-lg">Based on the ROI of {result.roi}, you could potentially increase net profit by another 12% by bulk-purchasing fertilizer via the Marketplace.</p>
                   </div>
                   <button className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3">
                      Go to Marketplace <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
