import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowRight, 
  FileSearch,
  Sparkles,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { EligibilityResult, GovScheme } from '../../types';

export const EligibilityCheckerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [formData, setFormData] = useState({
    farmerName: '',
    state: '',
    district: '',
    age: '',
    gender: 'Male',
    landOwnership: 'Owned',
    farmSize: '',
    annualIncome: '',
    cropType: '',
    category: 'General',
    existingBenefits: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/eligibility/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          farmSize: Number(formData.farmSize),
          annualIncome: Number(formData.annualIncome)
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter italic italic">Smart Eligibility</h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto italic">Our AI analyzes your profile to find matching government schemes, subsidies, and insurance plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form */}
        <div className="bg-white rounded-[50px] p-10 border-2 border-gray-100 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
              <FileSearch className="w-7 h-7" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 italic">Your Profile</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Farmer Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                  placeholder="Enter full name"
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Age</label>
                <input 
                  required
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="E.g. 45"
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">State</label>
                <input 
                  required
                  type="text" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="E.g. Maharashtra"
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Farm Size (Acres)</label>
                <input 
                  required
                  type="number" 
                  value={formData.farmSize}
                  onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                  placeholder="E.g. 5.5"
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Annual Income (INR)</label>
                <input 
                  required
                  type="number" 
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
                  placeholder="E.g. 150000"
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all shadow-inner"
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC/ST</option>
                </select>
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>Analyzing Profile...</>
              ) : (
                <>Check Eligibility <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-[50px] p-12 border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 shadow-sm">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-400 italic">No Analysis Yet</h3>
                  <p className="text-gray-400 font-medium max-w-xs">Fill out the form to see your tailored eligibility results and suggested schemes.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Score Card */}
                <div className="bg-white rounded-[40px] p-10 border-2 border-green-500 shadow-xl shadow-green-50 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black italic">Analysis Result</h3>
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                        AI Certified
                      </span>
                    </div>
                    <div className="flex items-center gap-8 mb-10">
                      <div className="w-24 h-24 rounded-full border-[6px] border-green-500 flex flex-col items-center justify-center bg-white shadow-inner">
                        <span className="text-3xl font-black text-gray-900">{result.eligibilityPercentage}%</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Match</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1 italic italic">Status</p>
                        <h4 className="text-3xl font-black text-green-600 tracking-tight italic">Highly Eligible</h4>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-green-500/5 rotate-12" />
                </div>

                {/* Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm">
                    <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 italic italic">
                      <CheckCircle2 className="w-5 h-5 text-green-500" /> Eligible
                    </h4>
                    <div className="space-y-3">
                      {result.eligibleSchemes.map((s: string) => (
                        <div key={s} className="p-4 bg-gray-50 rounded-2xl font-bold text-sm text-gray-700 flex items-center justify-between group cursor-pointer hover:bg-green-50 transition-all">
                          {s} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm">
                    <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 italic italic">
                      <AlertTriangle className="w-5 h-5 text-orange-500" /> Not Eligible
                    </h4>
                    <div className="space-y-3">
                      {result.notEligibleSchemes.map((s: string) => (
                        <div key={s} className="p-4 bg-gray-50 rounded-2xl font-bold text-sm text-gray-400 italic line-through">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Missing Requirements */}
                <div className="bg-orange-50 rounded-[40px] p-10 border-2 border-orange-100">
                  <h4 className="text-lg font-black text-orange-900 mb-6 italic italic">Missing Requirements</h4>
                  <div className="flex flex-wrap gap-3">
                    {result.missingRequirements.map((req, i) => (
                      <span key={i} className="px-5 py-2 bg-white rounded-xl text-xs font-bold text-orange-600 shadow-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
