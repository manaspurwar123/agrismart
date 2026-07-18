import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Download, 
  Trash2, 
  Eye,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DiseaseReport } from '../types';
import { Link } from 'react-router-dom';

export const DiseaseHistoryPage: React.FC = () => {
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'Unhealthy'>('All');

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

  const deleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await fetch(`/api/disease/${id}`, { method: 'DELETE' });
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = (r.cropName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                         (r.diseaseName || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesFilter = filter === 'All' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Diagnosis History</h1>
            <p className="text-gray-500">View and manage all your past crop disease reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export All
            </Button>
            <Link to="/disease-detection">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2">
                New Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by crop or disease..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['All', 'Healthy', 'Unhealthy'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  filter === f 
                  ? 'bg-green-100 text-[#2E7D32] border border-green-200' 
                  : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-8">Start your first analysis to see your history here.</p>
            <Link to="/disease-detection">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]">Start Diagnosis</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={report.imageUrl} alt={report.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                      report.status === 'Healthy' 
                      ? 'bg-green-500/80 text-white border-green-400' 
                      : 'bg-red-500/80 text-white border-red-400'
                    }`}>
                      {report.status}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{report.cropName}</h3>
                  <p className="text-sm text-[#2E7D32] font-medium mb-4">
                    {report.status === 'Healthy' ? 'Healthy Growth' : report.diseaseName}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                      <Link to={`/disease-details/${report.id}`}>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => deleteReport(report.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                    <div className="text-xs font-bold text-gray-400">
                      {report.confidenceScore}% Accuracy
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
