import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Newspaper,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const GovServicesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    available: 12,
    activeApps: 3,
    eligible: 5,
    pending: 2,
    approved: 1,
    rejected: 0
  });
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [newsRes, appsRes, schemesRes] = await Promise.all([
        fetch('/api/government-news'),
        fetch('/api/applications'),
        fetch('/api/schemes')
      ]);
      const newsData = await newsRes.json();
      const appsData = await appsRes.json();
      const schemesData = await schemesRes.json();
      
      setNews((Array.isArray(newsData) ? newsData : []).slice(0, 3));
      setStats({
        available: Array.isArray(schemesData) ? schemesData.length : 0,
        activeApps: Array.isArray(appsData) ? appsData.length : 0,
        eligible: 5, // Simulated for now
        pending: (Array.isArray(appsData) ? appsData : []).filter((a: any) => a.status === 'Submitted' || a.status === 'Under Review').length,
        approved: (Array.isArray(appsData) ? appsData : []).filter((a: any) => a.status === 'Approved').length,
        rejected: (Array.isArray(appsData) ? appsData : []).filter((a: any) => a.status === 'Rejected').length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Available Schemes', value: stats.available, icon: FileText, color: 'bg-blue-500', trend: '+2 this month' },
    { label: 'Active Applications', value: stats.activeApps, icon: Clock, color: 'bg-orange-500', trend: 'In progress' },
    { label: 'Eligible Schemes', value: stats.eligible, icon: CheckCircle2, color: 'bg-green-500', trend: 'Check now' },
    { label: 'Pending Updates', value: stats.pending, icon: AlertCircle, color: 'bg-yellow-500', trend: 'Action required' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic">Gov Portal</h1>
        <p className="text-gray-500 font-medium text-lg">Centralized portal for government welfare, subsidies, and insurance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] border-2 border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${stat.color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-4xl font-black text-gray-900">{stat.value}</h4>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black mb-8 italic">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/government/eligibility')}
                className="h-24 bg-green-50 text-green-600 rounded-3xl hover:bg-green-100 border-0 flex flex-col items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">Eligibility</span>
              </Button>
              <Button 
                onClick={() => navigate('/government/insurance')}
                className="h-24 bg-blue-50 text-blue-600 rounded-3xl hover:bg-blue-100 border-0 flex flex-col items-center justify-center gap-2"
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">Insurance</span>
              </Button>
              <Button 
                onClick={() => navigate('/government/loans')}
                className="h-24 bg-purple-50 text-purple-600 rounded-3xl hover:bg-purple-100 border-0 flex flex-col items-center justify-center gap-2"
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">Apply Loan</span>
              </Button>
            </div>
          </div>

          {/* Featured Schemes */}
          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black italic">Popular Schemes</h3>
              <Button variant="outline" className="rounded-2xl h-10 px-6 font-black text-[10px] uppercase tracking-widest border-gray-100">View All</Button>
            </div>
            <div className="space-y-4">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-green-500 transition-all group">
                  <div className="w-20 h-20 bg-white rounded-2xl shrink-0 overflow-hidden shadow-sm">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 0 ? '1592982537447-6f2a6a0c3c1b' : '1523348837708-15d4a09cfac2'}?q=80&w=200`} 
                      className="w-full h-full object-cover" 
                      alt="Scheme" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 mb-1 truncate">{i === 0 ? 'PM-KISAN' : 'Crop Insurance'}</h4>
                    <p className="text-gray-400 text-xs font-medium line-clamp-1">Direct income support to farmers families across the country.</p>
                  </div>
                  <Button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-500 group-hover:text-white shadow-sm transition-all border-0">
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Style Area */}
        <div className="space-y-8">
          {/* News Feed */}
          <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-black italic">Gov News</h3>
            </div>
            <div className="space-y-8">
              {news.map((item, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-gray-100 group cursor-pointer">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 bg-gray-300 rounded-full group-hover:bg-green-500 transition-colors" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <h4 className="font-black text-gray-900 group-hover:text-green-600 transition-colors">{item.title}</h4>
                  <p className="text-gray-400 text-xs font-medium mt-1 line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-12 rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-gray-100">
              Read All News
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
