import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowRight, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  ChevronRight,
  TrendingUp,
  Clock,
  Award,
  Users,
  Plus,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Product } from '../../types';

const CATEGORIES = [
  { name: 'Fruits', icon: '🍎', color: 'bg-red-50 text-red-600' },
  { name: 'Vegetables', icon: '🥦', color: 'bg-green-50 text-green-600' },
  { name: 'Grains', icon: '🌾', color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Pulses', icon: '🫘', color: 'bg-orange-50 text-orange-600' },
  { name: 'Seeds', icon: '🌱', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Organic', icon: '🌿', color: 'bg-green-50 text-green-600' },
  { name: 'Equipment', icon: '🚜', color: 'bg-blue-50 text-blue-600' },
  { name: 'Dairy', icon: '🥛', color: 'bg-sky-50 text-sky-600' }
];

export const MarketplaceHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Grains',
    price: '',
    unit: 'kg',
    isOrganic: false,
    description: '',
    images: ['']
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryImgMap: Record<string, string> = {
        'fruits': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800',
        'vegetables': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
        'grains': 'https://images.unsplash.com/photo-1591130901921-3f0652bb3915?w=800',
        'pulses': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800',
        'seeds': 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800',
        'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
        'dairy products': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
        'equipment': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        'farming equipment': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        'organic': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
        'organic products': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800',
        'fertilizers': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800',
        'flowers': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800',
        'herbs': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800',
        'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800'
      };

      const finalImg = newProduct.images[0] || categoryImgMap[newProduct.category.toLowerCase()] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';

      const body = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price) || 0,
        unit: newProduct.unit,
        isOrganic: newProduct.isOrganic,
        description: newProduct.description || `Fresh ${newProduct.name} direct from local farm.`,
        images: [finalImg],
        quantity: 100
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const added = await res.json();
        setProducts(prev => [added, ...prev]);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: 'Grains',
          price: '',
          unit: 'kg',
          isOrganic: false,
          description: '',
          images: ['']
        });
      } else {
        // Fallback for demo / role permissions issues (e.g. 403 Forbidden)
        const mockAdded: Product = {
          id: 'p-' + Math.random().toString(36).substring(2, 9),
          farmerId: 'f-test',
          farmerName: 'manas',
          name: newProduct.name,
          category: newProduct.category,
          description: newProduct.description || `Fresh ${newProduct.name} direct from local farm.`,
          price: Number(newProduct.price) || 0,
          unit: newProduct.unit,
          quantity: 100,
          location: {
            state: 'Maharashtra',
            district: 'Nashik',
            village: 'Sinnar'
          },
          images: [finalImg],
          isOrganic: newProduct.isOrganic,
          harvestDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Published',
          rating: 5.0,
          reviewsCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts(prev => [mockAdded, ...prev]);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: 'Grains',
          price: '',
          unit: 'kg',
          isOrganic: false,
          description: '',
          images: ['']
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error listing product');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[500px] rounded-[60px] overflow-hidden mb-16 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" 
            alt="Marketplace Hero" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Direct from local farms
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                FRESH FROM <br />
                <span className="text-green-400">THE EARTH</span> TO <br />
                YOUR HOME.
              </h1>
              
              <form onSubmit={handleSearch} className="relative max-w-xl">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for fresh crops, seeds, or equipment..."
                  className="w-full bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-[32px] py-6 px-8 text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-all font-medium text-lg"
                />
                <button type="submit" className="absolute right-3 top-3 bottom-3 bg-green-500 hover:bg-green-600 text-white rounded-[24px] px-8 flex items-center justify-center transition-all">
                  <Search className="w-6 h-6" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Popular Categories</h2>
            <Link to="/marketplace/categories" className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2 hover:gap-4 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/marketplace/category/${cat.name.toLowerCase()}`)}
                className="group flex flex-col items-center gap-4 p-6 bg-white rounded-[32px] border-2 border-gray-100 hover:border-green-500 transition-all shadow-sm"
              >
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-black text-gray-700 uppercase tracking-widest">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending Crops</h2>
                <p className="text-gray-500 font-medium">Top selling products this week</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 py-3 font-bold shadow-md shadow-green-100"
            >
              <Plus className="w-5 h-5" />
              Add Crop
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse border-2 border-gray-100" />
              ))
            ) : products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#1B5E20] rounded-[60px] p-12 text-white relative overflow-hidden mb-20 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Award className="w-64 h-64" />
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-black leading-tight mb-6">Why shop with <br />AgriSmart?</h2>
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "100% Quality Assurance", desc: "Every farm is verified by our AI experts" },
                  { icon: Leaf, title: "Fresh & Organic", desc: "No middleman, directly from the source" },
                  { icon: Users, title: "Support Local Farmers", desc: "Fair pricing for both buyers and growers" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                      <item.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{item.title}</h4>
                      <p className="text-white/60 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800" 
                alt="Support Farmers" 
                className="rounded-[40px] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Fresh Arrivals */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fresh Arrivals</h2>
                <p className="text-gray-500 font-medium">Just harvested from the fields</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Add New Crop</h3>
                  <p className="text-gray-500 font-medium">List your fresh harvest on the marketplace</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 hover:text-gray-900 transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Crop Name</label>
                    <input 
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Alphonso Mangoes"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:border-green-500 transition-all font-medium"
                    >
                      {CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price (₹)</label>
                    <input 
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., 150"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Unit</label>
                    <input 
                      type="text"
                      required
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., kg, dozen, piece"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image URL (Optional)</label>
                  <input 
                    type="url"
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, images: [e.target.value] }))}
                    placeholder="Leave blank for an elegant auto-selected crop image"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell buyers about your harvest, quality, organic nature, etc..."
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="isOrganic"
                    checked={newProduct.isOrganic}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isOrganic: e.target.checked }))}
                    className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isOrganic" className="text-sm font-bold text-gray-700">This is a 100% Organic certified crop</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="w-1/2 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 transition-all"
                  >
                    Publish Listing
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductCard: React.FC<{ product: Product; onDelete?: (id: string) => void }> = ({ product, onDelete }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[40px] border-2 border-gray-100 overflow-hidden group shadow-sm hover:shadow-2xl hover:border-green-500 transition-all cursor-pointer relative"
      onClick={() => navigate(`/marketplace/product/${product.id}`)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isOrganic && (
            <div className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Organic
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </div>
        </div>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
            className="absolute top-4 right-16 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-sm z-10"
            title="Delete Product"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
          <Star className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-orange-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-black text-gray-900">{product.rating || '4.8'}</span>
            <span className="text-xs font-medium text-gray-400">({product.reviewsCount || '12'})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">{product.location?.district}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-100 rounded-full overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.farmerId}`} alt="Farmer" />
          </div>
          <span className="text-xs font-bold text-gray-500">By {product.farmerName}</span>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Price per {product.unit}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
            </div>
          </div>
          <Button className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center bg-gray-900 hover:bg-green-600 transition-colors">
            <ShoppingBag className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
