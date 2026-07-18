import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  Star, 
  Package, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Boxes,
  Truck,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Product, Order } from '../../types';

export default function MarketplaceManagement() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products' || activeTab === 'inventory') {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } else {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Marketplace Management</h1>
          <p className="text-gray-500 font-medium">Manage all products, track orders, and monitor global inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'orders', label: 'Orders', icon: Truck },
          { id: 'inventory', label: 'Inventory', icon: Boxes },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '₹18.4L', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Orders', value: '142', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock', value: '28 Items', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Featured', value: '12 Products', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-gray-50 border-transparent rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:bg-white focus:border-green-500/30 transition-all outline-none">
              <option>Status: All</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Archived</option>
            </select>
            <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {activeTab === 'orders' ? 'Order ID & Date' : 'Product & Category'}
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {activeTab === 'orders' ? 'Customer' : 'Seller / Farmer'}
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {activeTab === 'orders' ? 'Total Amount' : 'Price & Stock'}
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10">
                      <div className="h-10 bg-gray-100 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : activeTab === 'products' ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300 m-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{product.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-700">{product.farmerName}</p>
                      <p className="text-xs text-gray-400">ID: {product.farmerId}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight">₹{product.price}/{product.unit}</p>
                      <p className={cn(
                        "text-xs font-bold",
                        product.quantity < 10 ? "text-orange-500" : "text-gray-400"
                      )}>
                        Stock: {product.quantity} {product.unit}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        product.status === 'Published' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                      )}>
                        {product.status === 'Published' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {product.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'orders' ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-700">{order.buyerName}</p>
                      <p className="text-xs text-gray-400">Order for: {order.productName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight mb-1">₹{(order.totalPrice || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400 font-bold">{order.quantity} Units</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        order.status === 'Completed' ? "bg-green-50 text-green-600" :
                        order.status === 'Pending' ? "bg-orange-50 text-orange-600" :
                        order.status === 'Accepted' ? "bg-blue-50 text-blue-600" :
                        "bg-red-50 text-red-600"
                      )}>
                        {order.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors shadow-sm ml-auto">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Inventory View
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{product.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-700">{product.farmerName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-gray-900">{product.quantity}</div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.unit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {product.quantity < 10 ? (
                        <div className="flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                          <AlertTriangle className="w-4 h-4" /> Low Stock
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" /> Adequate
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing last 10 entries</p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
