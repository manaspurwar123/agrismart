import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  TestTube2, 
  History, 
  Download, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  RefreshCcw,
  Zap,
  Droplets,
  Leaf,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const SoilAnalysisPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'manual' | 'image'>('manual');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    soilType: 'Loamy',
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 35,
    potassium: 40,
    organicCarbon: 0.8,
    moisture: 20,
    electricalConductivity: 0.5
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/soil/history');
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalyze = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/soil/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      const data = await res.json();
      setResult(data);
      setShowForm(false);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/soil/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
      setShowForm(false);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-10 w-64 bg-gray-200 rounded-xl" />
              <div className="h-14 w-48 bg-gray-200 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-[40px]" />
                <div className="h-64 bg-gray-200 rounded-[40px]" />
              </div>
              <div className="space-y-8">
                <div className="h-64 bg-gray-200 rounded-[40px]" />
                <div className="h-64 bg-gray-200 rounded-[40px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Nitrogen', value: formData.nitrogen, fill: '#4ADE80' },
    { name: 'Phosphorus', value: formData.phosphorus, fill: '#FB923C' },
    { name: 'Potassium', value: formData.potassium, fill: '#60A5FA' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Soil Intelligence</h1>
            <p className="text-gray-500">Analyze soil health and get personalized crop recommendations</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2 px-8 py-6 rounded-[24px] text-lg"
          >
            <Plus className="w-6 h-6" /> New Analysis
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence>
              {showForm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[40px] p-8 shadow-2xl border border-green-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black">Analyze Soil</h2>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      <RefreshCcw className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => setAnalysisMode('manual')}
                      className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${analysisMode === 'manual' ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      Manual Entry
                    </button>
                    <button 
                      onClick={() => setAnalysisMode('image')}
                      className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${analysisMode === 'image' ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Image AI</span>
                    </button>
                  </div>
                  {analysisMode === 'manual' ? (
                  <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Soil Type</label>
                        <select 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                          value={formData.soilType}
                          onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                        >
                          <option>Loamy</option>
                          <option>Sandy</option>
                          <option>Clay</option>
                          <option>Silty</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">pH Level ({formData.ph})</label>
                        <input 
                          type="range" min="0" max="14" step="0.1"
                          className="w-full accent-[#2E7D32]"
                          value={formData.ph}
                          onChange={(e) => setFormData({...formData, ph: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Nitrogen</label>
                          <input 
                            type="number"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                            value={formData.nitrogen}
                            onChange={(e) => setFormData({...formData, nitrogen: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Phosphorus</label>
                          <input 
                            type="number"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                            value={formData.phosphorus}
                            onChange={(e) => setFormData({...formData, phosphorus: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Potassium</label>
                          <input 
                            type="number"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                            value={formData.potassium}
                            onChange={(e) => setFormData({...formData, potassium: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-48 h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <Button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-4"
                      >
                        {isAnalyzing ? <RefreshCcw className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                        Run AI Soil Analysis
                      </Button>
                    </div>
                  </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imagePreview ? (
                          <img src={imagePreview} alt="Soil preview" className="max-h-64 mx-auto rounded-2xl shadow-lg" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-[#2E7D32]">
                              <UploadCloud className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Upload Soil Photo</h3>
                            <p className="text-gray-500 text-sm">Take a clear picture of the soil in natural lighting</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        disabled={!imageBase64 || isAnalyzing}
                        onClick={handleImageAnalyze}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-6 rounded-2xl text-lg font-black disabled:opacity-50"
                      >
                        {isAnalyzing ? 'Analyzing AI Models...' : 'Predict Soil Quality'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Result Card */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100"
              >
                <div className="bg-[#2E7D32] p-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-4 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md mb-4 inline-block">
                        AI Diagnosis Ready
                      </span>
                      <h2 className="text-4xl font-black">Soil Health: {result.healthScore}%</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs font-bold uppercase">Date</p>
                      <p className="font-bold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Leaf className="text-[#2E7D32]" /> Recommended Crops
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.suitableCrops?.map((crop: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-green-50 text-[#2E7D32] rounded-xl font-bold border border-green-100">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <AlertCircle className="text-orange-500" /> Improvements
                        </h3>
                        <ul className="space-y-3">
                          {result.recommendations?.map((rec: string, i: number) => (
                            <li key={i} className="flex gap-3 text-gray-600 text-sm">
                              <span className="text-orange-500 mt-1">•</span> {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-[32px] p-8">
                      <h3 className="text-xl font-bold mb-6">Farming Tips</h3>
                      <div className="space-y-6">
                        {result.tips?.map((tip: string, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* History Table */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Analysis History</h3>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Soil Type</th>
                      <th className="pb-4">pH</th>
                      <th className="pb-4">Score</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((report) => (
                      <tr key={report.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900">{new Date(report.analysisDate).toLocaleDateString()}</td>
                        <td className="py-6 text-gray-600">{report.soilType}</td>
                        <td className="py-6 text-gray-600">{report.ph}</td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            report.healthScore > 80 ? 'bg-green-100 text-green-700' :
                            report.healthScore > 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {report.healthScore}%
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="group-hover:bg-white">
                              <Download className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="group-hover:bg-white text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#1B5E20] rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TestTube2 className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-black mb-4 relative z-10">Need Expert Testing?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed relative z-10">
                Send your soil sample to our certified labs for a complete 24-parameter laboratory analysis.
              </p>
              <Button className="w-full bg-white text-[#1B5E20] hover:bg-gray-100 font-bold py-4">
                Order Test Kit
              </Button>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Nearby Testing Labs</h3>
              <div className="space-y-4">
                {[
                  { name: "Central Soil Lab", dist: "2.4 km", rating: 4.8 },
                  { name: "AgriHealth Center", dist: "5.1 km", rating: 4.5 },
                  { name: "Organic Earth Labs", dist: "12.0 km", rating: 4.9 }
                ].map((lab, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-bold text-sm">{lab.name}</p>
                      <p className="text-xs text-gray-500">{lab.dist} away</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#2E7D32]">
                      <span className="text-xs font-black">{lab.rating}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
