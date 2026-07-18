import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  X, 
  Search,
  Scale,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Info,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DiseaseReport } from '../types';

export const DiseaseComparisonPage: React.FC = () => {
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/disease/history');
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 3) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedReports = reports.filter(r => selectedIds.includes(r.id));

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <Link to="/disease-history" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to History
            </Link>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Compare Reports</h1>
            <p className="text-gray-500">Analyze up to 3 reports side-by-side to track recovery or compare diseases</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-400">Selected:</span>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg border-2 ${selectedIds[i] ? 'border-[#2E7D32] bg-green-50' : 'border-dashed border-gray-200 bg-gray-50'}`} />
              ))}
            </div>
          </div>
        </div>

        {selectedReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {selectedReports.map((report) => (
              <motion.div 
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative"
              >
                <button 
                  onClick={() => toggleSelection(report.id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={report.imageUrl} alt={report.cropName} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2E7D32]">{report.cropName}</span>
                    <h3 className="text-2xl font-black mb-2">{report.diseaseName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        report.status === 'Healthy' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Severity & Confidence</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{report.severity}</span>
                        <span className="text-xs font-bold">{report.confidenceScore}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            report.severity === 'Critical' ? 'bg-red-500' : 
                            report.severity === 'High' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${report.confidenceScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Organic Treatment</p>
                      <p className="text-xs text-gray-600 line-clamp-3">{report.treatment.organic}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <Link to={`/disease-details/${report.id}`}>
                        <Button variant="link" size="sm" className="text-[#2E7D32] p-0 h-auto font-bold">
                          View Full Report <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {selectedIds.length < 3 && (
              <div className="bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Add another report to compare</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[48px] p-20 text-center border border-gray-100 shadow-sm mb-12">
            <Scale className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Select Reports to Compare</h2>
            <p className="text-gray-500 max-w-md mx-auto">Select up to 3 reports from your history below to start the side-by-side analysis.</p>
          </div>
        )}

        {/* Selection Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent History</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search crop..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {reports.filter(r => (r.cropName || '').toLowerCase().includes((searchTerm || '').toLowerCase())).map((report) => (
              <button
                key={report.id}
                onClick={() => toggleSelection(report.id)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedIds.includes(report.id) ? 'border-[#2E7D32] ring-4 ring-green-100' : 'border-transparent'
                }`}
              >
                <img src={report.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 text-left">
                  <p className="text-[10px] text-white/80 font-bold uppercase">{report.cropName}</p>
                  <p className="text-xs text-white font-black truncate">{report.diseaseName}</p>
                </div>
                {selectedIds.includes(report.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedIds.indexOf(report.id) + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
