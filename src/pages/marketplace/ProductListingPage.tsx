import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Grid, 
  List as ListIcon, 
  SlidersHorizontal,
  ArrowLeft,
  X,
  MapPin,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from './MarketplaceHome';
import { Button } from '../../components/ui/Button';
import { Product } from '../../types';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters State
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: urlCategory || searchParams.get('category') || '',
    minPrice: searchParams.get('min') || '',
    maxPrice: searchParams.get('max') || '',
    organic: searchParams.get('organic') === 'true',
    sortBy: searchParams.get('sort') || 'latest'
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams, urlCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams);
      if (urlCategory) query.set('category', urlCategory);
      
      const res = await fetch(`/api/products?${query.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    const params = new URLSearchParams();
    if (updated.search) params.set('q', updated.search);
    if (updated.category) params.set('category', updated.category);
    if (updated.minPrice) params.set('min', updated.minPrice);
    if (updated.maxPrice) params.set('max', updated.maxPrice);
    if (updated.organic) params.set('organic', 'true');
    if (updated.sortBy) params.set('sort', updated.sortBy);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      organic: false,
      sortBy: 'latest'
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs & Title */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-bold transition-all mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                {urlCategory ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1) : 'Browse Marketplace'}
              </h1>
              <p className="text-gray-500 font-medium mt-2">Showing {products.length} high-quality results</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-white border-2 border-gray-100 rounded-2xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
              
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 h-14 px-8 rounded-2xl ${showFilters ? 'bg-green-600 text-white' : 'bg-white text-gray-900 border-2 border-gray-100'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Side Filters (Desktop) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full lg:w-80 shrink-0"
              >
                <div className="bg-white border-2 border-gray-100 rounded-[40px] p-8 sticky top-32">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Refine</h3>
                    <button onClick={clearFilters} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Clear All</button>
                  </div>

                  <div className="space-y-8">
                    {/* Search */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Keyword</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={filters.search}
                          onChange={(e) => updateFilters({ search: e.target.value })}
                          placeholder="What are you looking for?"
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold text-sm"
                        />
                        <Search className="absolute right-4 top-4 w-5 h-5 text-gray-300" />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Price Range (₹)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => updateFilters({ minPrice: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-4 outline-none transition-all font-bold text-sm"
                        />
                        <input 
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-4 outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>

                    {/* Organic Filter */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-black text-green-900 uppercase tracking-tight">Organic Only</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={filters.organic}
                        onChange={(e) => updateFilters({ organic: e.target.checked })}
                        className="w-6 h-6 rounded-lg accent-green-600 cursor-pointer"
                      />
                    </div>

                    {/* Sorting */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Sort By</label>
                      <select 
                        value={filters.sortBy}
                        onChange={(e) => updateFilters({ sortBy: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold text-sm appearance-none"
                      >
                        <option value="latest">Recently Added</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse border-2 border-gray-100" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[60px] p-24 text-center border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-12 h-12 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">No crops found</h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-12">
                  We couldn't find anything matching your search. Try adjusting your filters or browsing other categories.
                </p>
                <Button onClick={clearFilters} className="bg-gray-900 text-white rounded-[24px] px-12 py-5 font-black uppercase tracking-widest">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-10 10Z" />
    <path d="M11 20c-1.4 0-2.3-1.4-1.8-2.6.4-1.2 2.2-1.9 3.8-1.4 1.6.5 2.1 2.3 1.2 3.3C13.5 20 12.4 20 11 20Z" />
  </svg>
);
