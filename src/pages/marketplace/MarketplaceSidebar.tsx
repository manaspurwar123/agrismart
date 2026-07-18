import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Plus, 
  History, 
  Heart, 
  BarChart3, 
  Boxes,
  Bell,
  Settings,
  ArrowRight,
  Store,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: any;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Marketplace', path: '/marketplace', icon: Store },
  { label: 'My Products', path: '/marketplace/my-products', icon: Package, roles: ['farmer'] },
  { label: 'Add Product', path: '/marketplace/add-product', icon: Plus, roles: ['farmer'] },
  { label: 'My Orders', path: '/marketplace/orders', icon: History },
  { label: 'Wishlist', path: '/marketplace/wishlist', icon: Heart },
  { label: 'Notifications', path: '/marketplace/notifications', icon: Bell },
  { label: 'Inventory', path: '/marketplace/inventory', icon: Boxes, roles: ['farmer'] },
  { label: 'Sales Analytics', path: '/marketplace/sales-analytics', icon: BarChart3, roles: ['farmer'] },
];

export const MarketplaceSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredItems = NAV_ITEMS.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="w-80 h-[calc(100vh-8rem)] sticky top-32 hidden xl:block">
      <div className="bg-white rounded-[48px] border-2 border-gray-100 shadow-xl h-full flex flex-col p-8 overflow-hidden relative">
        {/* Profile Summary */}
        <div className="mb-12 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="User" />
            </div>
            <div>
              <h4 className="text-lg font-black text-gray-900 leading-tight truncate w-32">{user?.name}</h4>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{user?.role} Account</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Orders</p>
              <p className="text-xl font-black text-gray-900">12</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Credits</p>
              <p className="text-xl font-black text-gray-900">₹450</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 relative z-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Menu Navigation</p>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-gray-900 text-white shadow-2xl shadow-gray-200" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-green-400" : "text-gray-400 group-hover:text-gray-900")} />
                  <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="mt-8 pt-8 border-t border-gray-100 relative z-10">
          <Link to="/profile" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Settings</span>
          </Link>
          <button className="flex items-center justify-between w-full mt-6 bg-green-500 hover:bg-green-600 text-white p-6 rounded-[32px] transition-all group shadow-xl shadow-green-100">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Help & Support</p>
              <h5 className="font-black text-sm">AgriSmart AI Support</h5>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Ambient Decorative */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none opacity-50" />
      </div>
    </div>
  );
};
