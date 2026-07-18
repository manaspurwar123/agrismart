import React, { useState } from 'react';
import { Sprout, Search, Thermometer, Droplets, MapPin, Wind, Sparkles, Leaf } from 'lucide-react';
import { CropRecommendation } from '../types';

export default function CropAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendation | null>(null);
  const [formData, setFormData] = useState({
    state: 'Punjab',
    district: 'Amritsar',
    season: 'Summer',
    soilType: 'Alluvial',
    rainfall: '800',
    temperature: '32'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-3xl mb-6">
          <Sprout className="w-8 h-8 text-[#2E7D32]" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Crop Recommendation</h1>
        <p className="text-gray-500">Get data-driven suggestions for your next harvest.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#2E7D32]" />
            Farm Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">State</label>
                <input 
                  type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">District</label>
                <input 
                  type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Soil Type</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#2E7D32] outline-none"
                value={formData.soilType} onChange={e => setFormData({...formData, soilType: e.target.value})}
              >
                <option value="Alluvial">Alluvial</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Laterite">Laterite</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Rainfall (mm)</label>
                <div className="relative">
                  <input 
                    type="number" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#2E7D32] outline-none"
                    value={formData.rainfall} onChange={e => setFormData({...formData, rainfall: e.target.value})}
                  />
                  <Droplets className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Temp (°C)</label>
                <div className="relative">
                  <input 
                    type="number" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#2E7D32] outline-none"
                    value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})}
                  />
                  <Thermometer className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-[#2E7D32] text-white rounded-2xl font-bold hover:bg-[#1B5E20] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-pulse" /> Analyzing...
                </span>
              ) : 'Generate Recommendation'}
            </button>
          </form>
        </div>

        <div className="flex flex-col">
          {result ? (
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-3xl p-8 text-white shadow-2xl flex-grow animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-[#81C784]" />
                <h3 className="text-xl font-bold">Best Match Found</h3>
              </div>
              
              <h4 className="text-5xl font-black mb-8 leading-tight">{result.recommendedCrop}</h4>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[#81C784] text-xs font-bold uppercase tracking-wider mb-1">Est. Yield</p>
                  <p className="text-xl font-bold">{result.expectedYield}</p>
                </div>
                <div>
                  <p className="text-[#81C784] text-xs font-bold uppercase tracking-wider mb-1">Est. Profit</p>
                  <p className="text-xl font-bold">₹{result.estimatedProfit}</p>
                </div>
                <div>
                  <p className="text-[#81C784] text-xs font-bold uppercase tracking-wider mb-1">Water Need</p>
                  <p className="text-xl font-bold">{result.waterRequirement}</p>
                </div>
                <div>
                  <p className="text-[#81C784] text-xs font-bold uppercase tracking-wider mb-1">Harvest Time</p>
                  <p className="text-xl font-bold">{result.cropDuration}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Why this crop?
                </h5>
                <p className="text-sm opacity-90 leading-relaxed">
                  {result.reason}
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center flex-grow">
              <Sprout className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Enter your details to see <br /> AI recommendations here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
