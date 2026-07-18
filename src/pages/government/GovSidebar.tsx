import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScrollText, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  FolderOpen, 
  Navigation,
  Newspaper,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
  { label: 'All Schemes', path: '/government/schemes', icon: ScrollText },
  { label: 'Eligibility', path: '/government/eligibility', icon: CheckCircle2 },
  { label: 'Insurance', path: '/government/insurance', icon: ShieldCheck },
  { label: 'Loans & Credit', path: '/government/loans', icon: CreditCard },
  { label: 'Applications', path: '/government/applications', icon: FileText },
  { label: 'My Documents', path: '/government/documents', icon: FolderOpen },
  { label: 'Tracker', path: '/government/tracker', icon: Navigation },
  { label: 'Gov News', path: '/government/news', icon: Newspaper },
];

export const GovSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-80 shrink-0 py-12 hidden lg:block">
      <div className="sticky top-32 space-y-8">
        <div className="bg-white rounded-[32px] p-8 border-2 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Gov Services</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Farmer Welfare</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    isActive 
                      ? 'bg-green-500 text-white shadow-xl shadow-green-100' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-white rounded-full" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gray-900 rounded-[32px] p-8 text-white overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="font-black text-lg mb-2">Need Help?</h3>
            <p className="text-gray-400 text-sm font-medium mb-6">Contact Kisan Helpline for any scheme queries.</p>
            <button className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              Call 155261
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-colors" />
        </div>
      </div>
    </aside>
  );
};
