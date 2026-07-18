import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  Search,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Product } from '../../types';
import { ProductCard } from './MarketplaceHome';

export const WishlistPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
      if (res.ok) fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <button 
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-bold transition-all mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Wishlist</h1>
            <p className="text-gray-500 font-medium">Keep track of crops you're interested in</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">{products.length}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saved Items</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[40px] h-[400px] animate-pulse border-2 border-gray-100" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-4 right-16 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[60px] p-24 text-center border-2 border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">Start saving items you like and they will appear here for easy access later.</p>
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-gray-900 text-white rounded-[24px] px-12 py-5 font-black uppercase tracking-widest text-xs"
            >
              Browse Products
            </Button>
          </div>
        )}

        {/* Recommended Items (Mock) */}
        {products.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">You might also like</h2>
              <Link to="/marketplace" className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2 hover:gap-4 transition-all">
                Explore More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              {/* Mock recommendations */}
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[40px] h-[350px] border-2 border-gray-100 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-200" />
                  </div>
                  <h4 className="font-black text-gray-400 uppercase tracking-widest text-xs">Fresh Seasonal Product</h4>
                  <p className="text-gray-300 text-[10px] font-bold mt-2">Recommended for you</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
