import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Application } from '../../types';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = applications.filter(a => {
    const matchesSearch = (a.schemeTitle || '').toLowerCase().includes((search || '').toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-500 bg-green-50 border-green-100';
      case 'Rejected': return 'text-red-500 bg-red-50 border-red-100';
      case 'Under Review': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'Submitted': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const statusOptions = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic italic">My Applications</h1>
          <p className="text-gray-500 font-medium text-lg">Track the status of your submitted schemes and insurance claims.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
                statusFilter === status 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white text-gray-400 border-2 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search application..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 h-14 pl-12 pr-6 rounded-2xl font-bold focus:border-green-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border-2 border-gray-100" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-[50px] p-24 text-center border-2 border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-inner">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 italic italic">No applications found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">You haven't submitted any applications matching the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[32px] p-8 border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${getStatusColor(app.status)}`}>
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="text-xl font-black text-gray-900 leading-tight italic">{app.schemeTitle}</h4>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> ID: {app.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all">
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500 transition-all">
                    <Eye className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={() => deleteApplication(app.id)}
                    variant="outline" 
                    className="h-12 w-12 rounded-xl border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <div className="w-px h-8 bg-gray-100 mx-2 hidden md:block" />
                  <Button className="h-12 px-8 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                    Check Status
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && applications.length > 0 && (
        <div className="bg-gray-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic">Application Summary</h3>
              <p className="text-gray-400 font-medium">You have {applications.length} active applications in the system.</p>
            </div>
          </div>
          <Button className="bg-white text-gray-900 px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all relative z-10">
            Download Report <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        </div>
      )}
    </div>
  );
};
