import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Plus, Heart, ShoppingCart } from 'lucide-react';
import { Product, User } from '../types';

export default function Marketplace({ user }: { user: User | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (p.category || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Farmer's Marketplace</h1>
          <p className="text-gray-500 mt-2">Direct from the fields to your doorstep.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" placeholder="Search fresh produce..."
              className="pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-[#2E7D32]"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          </div>
          {user?.role === 'farmer' && (
            <button className="flex items-center gap-2 px-6 py-4 bg-[#2E7D32] text-white rounded-2xl font-bold hover:bg-[#1B5E20] transition-all shadow-lg shadow-green-100">
              <Plus className="w-5 h-5" /> Sell Produce
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={product.images[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb0?auto=format&fit=crop&q=80&w=600'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-[#2E7D32] font-black">${product.price}/{product.unit}</p>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Qty: {product.quantity} {product.unit} left</span>
                  <button className="p-3 bg-[#F1F8E9] text-[#2E7D32] rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No products found match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
