import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  ArrowLeft, 
  ShoppingBag, 
  Phone, 
  Mail, 
  MessageSquare,
  Clock,
  Calendar,
  Package,
  Award,
  ChevronRight,
  Share2,
  Heart,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Product, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Order Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    deliveryAddress: '',
    contactNumber: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    checkWishlist();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/reviews/${id}`)
      ]);
      const pData = await pRes.json();
      const rData = await rRes.json();
      
      setProduct(pData);
      setReviews(rData);
      setMainImage(pData.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setIsWishlisted(data.some((p: any) => p.id === id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      if (isWishlisted) {
        await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id })
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          productName: product?.name,
          farmerId: product?.farmerId,
          quantity,
          totalPrice: (product?.price || 0) * quantity,
          ...orderForm
        })
      });
      if (res.ok) {
        alert("Purchase request sent successfully!");
        setShowOrderModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center bg-[#F9FBFA]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-32 text-center bg-[#F9FBFA]">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-black">Product not found</h2>
      <Button onClick={() => navigate('/marketplace')} className="mt-8">Back to Marketplace</Button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-bold transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square md:aspect-video rounded-[60px] overflow-hidden bg-white border-2 border-gray-100 shadow-xl"
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                {product.isOrganic && (
                  <div className="bg-green-500 text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-2xl">
                    Certified Organic
                  </div>
                )}
                <div className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                  {product.category}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-6">
              {(product.images.length > 0 ? product.images : [mainImage]).map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-3xl overflow-hidden border-4 transition-all ${mainImage === img ? 'border-green-500 shadow-lg scale-105' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-black text-gray-900">{product.rating || '4.8'}</span>
                  <span className="text-sm font-bold text-gray-400">({product.reviewsCount || '12'} reviews)</span>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-600 transition-all shadow-sm">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleWishlist}
                    className={`w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isWishlisted ? 'text-red-500 border-red-100' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-4 tracking-tighter">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-8">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
                  {product.location?.village}, {product.location?.district}, {product.location?.state}
                </span>
              </div>

              <div className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-xl mb-8">
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                  <span className="text-lg font-bold text-gray-400">/ per {product.unit}</span>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Available Stock</span>
                    <span className="text-sm font-black text-green-600 uppercase tracking-widest">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Harvested On</span>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Quality Grade</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">Grade A+ Premium</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all font-black text-xl"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-black text-lg text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all font-black text-xl"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</div>
                    <div className="text-2xl font-black text-gray-900 leading-none">₹{product.price * quantity}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowOrderModal(true)}
                  className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-green-600 text-white font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 transition-all"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Send Purchase Request
                </Button>
              </div>

              {/* Farmer Profile Quick Card */}
              <div className="bg-green-50 rounded-[32px] p-6 border-2 border-green-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.farmerId}`} alt="Farmer" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none mb-1">Merchant</p>
                  <h4 className="text-lg font-black text-gray-900 leading-tight mb-1">{product.farmerName}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                      <MapPin className="w-3 h-3" /> {product.location?.district}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-green-500" /> Verified
                    </div>
                  </div>
                </div>
                <Button className="w-12 h-12 rounded-xl p-0 bg-white text-gray-900 border-2 border-white shadow-sm hover:border-green-500">
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl mb-12">
              <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Product Description</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12">
                {product.description}
              </p>

              <h4 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Technical Specifications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Freshness', value: 'High (Harvested < 24h ago)', icon: Clock },
                  { label: 'Storage', value: 'Cool Dry Place', icon: Package },
                  { label: 'Variety', value: 'Premium Local', icon: Award },
                  { label: 'Shelf Life', value: '15-20 Days', icon: Calendar }
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[24px] border-2 border-transparent hover:border-green-100 transition-all">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <spec.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
                      <p className="font-bold text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Community Reviews</h3>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">4.8 / 5.0</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on {reviews.length} reviews</div>
                  </div>
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-6 h-6 ${i <= 4 ? 'fill-current' : ''}`} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {reviews.length > 0 ? reviews.map((review, i) => (
                  <div key={i} className="pb-10 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} alt="Reviewer" />
                        </div>
                        <div>
                          <h5 className="font-black text-gray-900">{review.userName}</h5>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-orange-400">
                        {Array(5).fill(0).map((_, idx) => (
                          <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-current' : 'opacity-20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                    {review.reply && (
                      <div className="mt-6 ml-8 p-6 bg-green-50 rounded-[24px] border-l-4 border-green-500">
                        <div className="flex items-center gap-2 mb-2 text-xs font-black text-green-600 uppercase tracking-widest">
                          <MessageSquare className="w-3 h-3" /> Farmer's Response
                        </div>
                        <p className="text-green-900 font-medium text-sm">{review.reply}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            {/* Safe Buying Tips */}
            <div className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-xl mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Buying Safely</h4>
              <ul className="space-y-4">
                {[
                  "Never pay in advance before seeing the product",
                  "Verify the farm location via our Farm Map",
                  "Check the harvest date for freshness",
                  "Use our chat system for all communication"
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-gray-500">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-8 border-gray-100 rounded-2xl py-6 font-black uppercase tracking-widest text-xs">
                Learn Security Protocols
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Request Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-lg bg-white rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Purchase Request</h3>
                  <button onClick={() => setShowOrderModal(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleOrder} className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-[32px] border-2 border-gray-100 flex items-center gap-4 mb-8">
                    <img src={product.images?.[0]} alt={product.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h4 className="font-black text-gray-900">{product.name}</h4>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{quantity} {product.unit} × ₹{product.price}</p>
                      <p className="text-xl font-black text-green-600 mt-1">Total: ₹{product.price * quantity}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Delivery Address</label>
                    <textarea 
                      required
                      value={orderForm.deliveryAddress}
                      onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                      placeholder="Street name, Village, District, State..."
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-3xl py-4 px-6 outline-none transition-all font-bold text-sm min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Contact Number</label>
                    <input 
                      type="tel"
                      required
                      value={orderForm.contactNumber}
                      onChange={(e) => setOrderForm({...orderForm, contactNumber: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-3xl py-4 px-6 outline-none transition-all font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Special Note (Optional)</label>
                    <input 
                      type="text"
                      value={orderForm.message}
                      onChange={(e) => setOrderForm({...orderForm, message: e.target.value})}
                      placeholder="Eg: Call before arriving"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-3xl py-4 px-6 outline-none transition-all font-bold text-sm"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-green-600 text-white font-black uppercase tracking-widest text-lg transition-all"
                  >
                    {submitting ? 'Processing...' : 'Confirm & Request Purchase'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
