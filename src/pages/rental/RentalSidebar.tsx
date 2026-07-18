import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Wrench, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  FileText,
  PieChart,
  User
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const FinanceRentalSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { section: 'Rental Platform', items: [
      { name: 'Equipment Rental', path: '/rental', icon: Wrench },
      { name: 'Vehicle Rental', path: '/rental/vehicles', icon: Truck },
      { name: 'My Bookings', path: '/rental/bookings', icon: Calendar },
      { name: 'My Equipment', path: '/rental/my-machinery', icon: User },
    ]},
    { section: 'Farm Finance', items: [
      { name: 'Finance Overview', path: '/finance', icon: LayoutDashboard },
      { name: 'Expense Tracker', path: '/finance/expenses', icon: TrendingDown },
      { name: 'Income Tracker', path: '/finance/income', icon: TrendingUp },
      { name: 'Farm Inventory', path: '/finance/inventory', icon: Package },
      { name: 'Reports & Analytics', path: '/finance/reports', icon: PieChart },
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
                      ? "bg-green-700 text-white shadow-xl shadow-green-100" 
                      : "text-gray-500 hover:bg-white hover:text-gray-900"
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

      {/* Quick Summary Card */}
      <div className="mt-12 bg-gradient-to-br from-green-700 to-green-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Net Balance</p>
        <p className="text-3xl font-black mb-6">₹1,24,500</p>
        <div className="flex items-center gap-2 text-green-300 font-bold text-xs">
          <TrendingUp className="w-4 h-4" />
          <span>+12% this month</span>
        </div>
      </div>
    </aside>
  );
};
