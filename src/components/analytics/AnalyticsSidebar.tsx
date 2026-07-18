import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Droplets, 
  Sprout, 
  CloudRain, 
  Bug, 
  Globe, 
  FileText, 
  Zap, 
  Download,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AnalyticsSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { section: 'Overview', items: [
      { name: 'Business Dashboard', path: '/analytics/dashboard', icon: LayoutDashboard },
      { name: 'Farm Analytics', path: '/analytics/farm', icon: BarChart3 },
    ]},
    { section: 'AI Predictions', items: [
      { name: 'Yield Prediction', path: '/analytics/yield-prediction', icon: TrendingUp },
      { name: 'Profit Prediction', path: '/analytics/profit-prediction', icon: DollarSign },
    ]},
    { section: 'Resource Analytics', items: [
      { name: 'Expense Analytics', path: '/analytics/expenses', icon: PieChart },
      { name: 'Water Analytics', path: '/analytics/water', icon: Droplets },
      { name: 'Soil Analytics', path: '/analytics/soil', icon: Sprout },
    ]},
    { section: 'Risk & Environment', items: [
      { name: 'Weather Analytics', path: '/analytics/weather', icon: CloudRain },
      { name: 'Disease Analytics', path: '/analytics/disease', icon: Bug },
    ]},
    { section: 'Intelligence & Reports', items: [
      { name: 'Market Intelligence', path: '/analytics/market', icon: Globe },
      { name: 'AI Insights', path: '/analytics/insights', icon: Zap },
      { name: 'Reports Center', path: '/analytics/reports', icon: FileText },
      { name: 'Export Center', path: '/analytics/export', icon: Download },
    ]}
  ];

  return (
    <aside className="w-80 shrink-0 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto pr-6 hidden xl:block scrollbar-hide">
      <div className="space-y-10">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                      : "text-gray-500 hover:bg-white hover:text-gray-900 shadow-sm shadow-transparent hover:shadow-gray-100"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                    location.pathname === item.path ? "text-white" : "text-gray-400"
                  )} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* KPI Highlight Card */}
      <div className="mt-12 bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Net Profit Target</p>
        </div>
        <div className="space-y-1 mb-6">
          <p className="text-2xl font-black">85%</p>
          <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-green-400 rounded-full" />
          </div>
        </div>
        <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase tracking-tighter">You are $45k away from your quarterly goal</p>
      </div>
    </aside>
  );
};
