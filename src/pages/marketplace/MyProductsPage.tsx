import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  BarChart3,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Product } from '../../types';

export const MyProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch('/api/products?farmerId=current'); // Backend handles 'current' filter
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMyProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'Published' ? 'Hidden' : 'Published';
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchMyProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'Published').length,
    outOfStock: products.filter(p => p.quantity <= 0).length,
    avgRating: products.length > 0 ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1) : 'N/A'
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (p.category || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Products</h1>
            <p className="text-gray-500 font-medium">Manage your active listings and storefront</p>
          </div>
          <Button 
            onClick={() => navigate('/marketplace/add-product')}
            className="h-16 px-10 rounded-[24px] bg-gray-900 hover:bg-green-600 text-white font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-xl"
          >
            <Plus className="w-5 h-5" />
            List New Crop
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Products', value: stats.active, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Listings', value: stats.total, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Store Rating', value: stats.avgRating, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border-2 border-gray-100 shadow-sm"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-[40px] p-6 border-2 border-gray-100 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="Search your products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-12 outline-none transition-all font-bold"
            />
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-300" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold text-sm appearance-none">
              <option>All Categories</option>
              <option>Published</option>
              <option>Hidden</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-[48px] border-2 border-gray-100 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-100">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                          <div>
                            <p className="font-black text-gray-900">{p.name}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-900">₹{p.price}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">per {p.unit}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className={`font-black ${p.quantity <= 0 ? 'text-red-500' : 'text-gray-900'}`}>{p.quantity} {p.unit}</p>
                        <div className="w-24 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${p.quantity > 50 ? 'bg-green-500' : p.quantity > 10 ? 'bg-orange-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(100, (p.quantity / 100) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.status === 'Published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'Published' ? 'text-green-600' : 'text-gray-400'}`}>
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/marketplace/product/${p.id}`}
                            className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all hover:border-blue-100"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => navigate(`/marketplace/edit-product/${p.id}`)}
                            className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-500 transition-all hover:border-green-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toggleStatus(p)}
                            className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all hover:border-orange-100"
                          >
                            {p.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-24 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">No products listed</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">Start your journey by adding your first agricultural product to the marketplace.</p>
              <Button 
                onClick={() => navigate('/marketplace/add-product')}
                className="bg-gray-900 text-white rounded-[24px] px-10 py-5 font-black uppercase tracking-widest text-xs"
              >
                Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
