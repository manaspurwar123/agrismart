import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, ChevronLeft, Plus, X, Sprout, 
  TrendingUp, Droplets, FlaskConical, Clock, 
  ShoppingCart, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CropRecommendation } from '../types';
import { cn } from '../lib/utils';

export default function RecommendationComparisonPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CropRecommendation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/crop-recommendation/history');
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to fetch history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedRecommendations = history.filter(r => selectedIds.includes(r.id));

  const compareFields = [
    { label: 'Recommended Crop', key: 'recommendedCrop', icon: Leaf },
    { label: 'Estimated Profit', key: 'estimatedProfit', icon: TrendingUp, format: (val: number) => `₹${(val || 0).toLocaleString()}/Acre` },
    { label: 'Expected Yield', key: 'expectedYield', icon: Sprout },
    { label: 'Water Requirement', key: 'waterRequirement', icon: Droplets },
    { label: 'Crop Duration', key: 'cropDuration', icon: Clock },
    { label: 'Fertilizer Need', key: 'fertilizerSuggestion', icon: FlaskConical },
    { label: 'Market Demand', key: 'marketDemand', icon: ShoppingCart },
    { label: 'Confidence Score', key: 'confidenceScore', icon: Info, format: (val: number) => `${val}%` },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Scale className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl border border-white">
              <Scale size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Compare Recommendations</h1>
              <p className="text-gray-600 font-medium">Select up to 3 recommendations to compare side-by-side.</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-700 font-bold hover:underline"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        </div>

        {/* Selection Bar */}
        <div className="bg-white p-6 rounded-[32px] shadow-xl border border-white/40">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-black uppercase tracking-widest text-gray-400 mr-4">Select to compare:</span>
            {history.length === 0 ? (
              <p className="text-gray-400 italic">No recommendations found. Generate some first!</p>
            ) : (
              history.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleSelection(item.id)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-bold transition-all border",
                    selectedIds.includes(item.id)
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                  )}
                >
                  {item.recommendedCrop} ({new Date(item.createdAt).toLocaleDateString()})
                </button>
              ))
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedRecommendations.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="p-10 text-left text-sm font-black uppercase tracking-widest min-w-[200px]">Features</th>
                    {selectedRecommendations.map(rec => (
                      <th key={rec.id} className="p-10 text-center min-w-[300px] border-l border-white/10">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center">
                            <Leaf size={40} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black">{rec.recommendedCrop}</h3>
                            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">{rec.farmName}</p>
                          </div>
                          <button 
                            onClick={() => toggleSelection(rec.id)}
                            className="p-2 bg-white/10 hover:bg-rose-500 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {compareFields.map((field, i) => (
                    <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <field.icon size={20} />
                          </div>
                          <span className="font-black text-gray-900 text-sm uppercase tracking-widest">{field.label}</span>
                        </div>
                      </td>
                      {selectedRecommendations.map(rec => {
                        const val = (rec as any)[field.key];
                        return (
                          <td key={rec.id} className="p-8 text-center border-l border-gray-50">
                            <p className={cn(
                              "text-lg font-bold text-gray-700",
                              field.key === 'estimatedProfit' && "text-emerald-600 font-black text-xl"
                            )}>
                              {field.format ? field.format(val) : val}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-8"></td>
                    {selectedRecommendations.map(rec => (
                      <td key={rec.id} className="p-8 text-center border-l border-gray-50">
                        <button 
                          onClick={() => navigate(`/recommendation/${rec.id}`)}
                          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl"
                        >
                          View Full Report
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 text-center space-y-8 shadow-xl">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-200">
              <Scale size={64} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Select to Compare</h2>
              <p className="text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                Choose up to three different crop recommendations from the list above to compare their profitability, yield, and water requirements.
              </p>
            </div>
            <button
              onClick={() => navigate('/crop-recommendation')}
              className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200"
            >
              Generate New Recommendation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Leaf(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13" />
      <path d="M19 2c-1.5 3-2 3.5-5 5" />
      <path d="M11 20c-.5-1.5-.5-1.5-1-3" />
    </svg>
  );
}
