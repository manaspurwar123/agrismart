import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calculator, 
  History, 
  FilePlus,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { InsuranceClaim, InsurancePlan } from '../../types';

export const CropInsurancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'claim' | 'history'>('plans');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<InsuranceClaim[]>([]);
  const [formData, setFormData] = useState({
    policyNumber: '',
    cropName: '',
    damageReason: 'Rainfall',
    damagePercentage: '',
    incidentDate: '',
    farmLocation: '',
    notes: ''
  });

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/insurance/history');
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/insurance/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setActiveTab('history');
        setFormData({
          policyNumber: '',
          cropName: '',
          damageReason: 'Rainfall',
          damagePercentage: '',
          incidentDate: '',
          farmLocation: '',
          notes: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const plans: InsurancePlan[] = [
    {
      id: 'plan-1',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      provider: 'Government of India',
      coverageDetails: 'Comprehensive coverage against non-preventable risks.',
      premiumRate: 2,
      benefits: ['Low premium', 'Quick settlement', 'Post-harvest coverage']
    },
    {
      id: 'plan-2',
      name: 'Weather Based Crop Insurance',
      provider: 'Agri-Insurers Ltd',
      coverageDetails: 'Covers crop loss due to specific weather events.',
      premiumRate: 1.5,
      benefits: ['Parametric payout', 'No damage survey required']
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic italic">Crop Insurance</h1>
          <p className="text-gray-500 font-medium text-lg">Protect your hard work from unpredictable climate risks.</p>
        </div>
        <div className="flex bg-white rounded-2xl p-2 border-2 border-gray-100 shadow-sm">
          {['plans', 'claim', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'plans' && (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {plans.map((plan, i) => (
              <div key={plan.id} className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Premium Rate</p>
                      <p className="text-3xl font-black text-gray-900">{plan.premiumRate}%</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{plan.name}</h3>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-6 italic italic">{plan.provider}</p>
                  
                  <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    {plan.coverageDetails}
                  </p>

                  <div className="space-y-3 mb-10">
                    {plan.benefits.map((b, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> {b}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 h-14 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-100">
                      View Details
                    </Button>
                    <Button variant="outline" className="h-14 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Calculate
                    </Button>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'claim' && (
          <motion.div 
            key="claim"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-[50px] p-12 border-2 border-gray-100 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 italic">File Damage Claim</h2>
                    <p className="text-gray-400 font-medium text-sm">Please provide accurate details for quick verification.</p>
                  </div>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Policy Number</label>
                      <input 
                        required
                        type="text" 
                        value={formData.policyNumber}
                        onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                        placeholder="E.g. POL-1234567"
                        className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Crop Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.cropName}
                        onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                        placeholder="E.g. Wheat"
                        className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Reason</label>
                      <select 
                        value={formData.damageReason}
                        onChange={(e) => setFormData({...formData, damageReason: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-red-500 transition-all"
                      >
                        <option>Rainfall</option>
                        <option>Drought</option>
                        <option>Pest Attack</option>
                        <option>Storm</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Damage %</label>
                      <input 
                        required
                        type="number" 
                        value={formData.damagePercentage}
                        onChange={(e) => setFormData({...formData, damagePercentage: e.target.value})}
                        placeholder="E.g. 60"
                        className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Incident Date</label>
                      <input 
                        required
                        type="date" 
                        value={formData.incidentDate}
                        onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic italic">Upload Evidence (Images)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer group">
                        <Camera className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Add Photo</span>
                      </div>
                      <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer group">
                        <Upload className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Documents</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      disabled={loading}
                      className="w-full h-20 bg-red-500 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-red-100"
                    >
                      {loading ? 'Submitting Claim...' : 'Submit Claim Request'}
                    </Button>
                  </div>
                </form>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {history.length === 0 ? (
              <div className="bg-white rounded-[50px] p-24 text-center border-2 border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200">
                  <History className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 italic">No Claim History</h3>
                <p className="text-gray-400 font-medium">You haven't filed any insurance claims yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {history.map((claim) => (
                  <div key={claim.id} className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-500 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover:rotate-12 transition-transform">
                        <FilePlus className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-black text-gray-900">{claim.cropName} Damage</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            claim.status === 'Approved' ? 'bg-green-100 text-green-600' :
                            claim.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{claim.policyNumber} • {new Date(claim.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="h-12 px-8 rounded-xl border-gray-100 font-black text-[10px] uppercase tracking-widest hover:border-blue-500">
                      View Status
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
