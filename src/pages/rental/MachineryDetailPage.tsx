import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Zap,
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  ChevronRight,
  User,
  Share2,
  Heart
} from 'lucide-react';
import { Machinery } from '../../types';
import { BookingForm } from '../../components/rental/BookingForm';
import { cn } from '../../lib/utils';

export const MachineryDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Machinery | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/machinery/${id}`);
      const data = await res.json();
      setItem(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Equipment not found</h2>
        <button onClick={() => navigate(-1)} className="text-green-700 font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Collection
        </button>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-red-50 group transition-all shadow-sm">
            <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/50">
              <img 
                src={item.images[activeImage]} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                    activeImage === i ? "border-green-600 scale-105" : "border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                {item.category}
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                Model {item.year}
              </span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="text-lg font-black text-gray-900">{item.rating}</span>
                <span className="text-gray-400 font-bold">({item.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
              {item.name}
            </h1>

            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[32px]">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                {item.ownerAvatar ? <img src={item.ownerAvatar} alt="" /> : <User className="text-gray-400" />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Equipment Owner</p>
                <p className="text-lg font-black text-gray-900 leading-none">{item.ownerName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Location</p>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 leading-none">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {item.location?.address ? item.location.address.split(',')[0] : 'Sinnar'}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: 'Working Capacity', value: item.workingCapacity, icon: Zap },
                { label: 'Fuel Type', value: item.fuelType, icon: ShieldCheck },
                { label: 'Fuel Cons.', value: item.fuelConsumption, icon: Star },
                ...item.specifications.map(s => ({ label: s.key, value: s.value, icon: Wrench }))
              ].map((spec, i) => (
                <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <spec.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="text-sm font-black text-gray-900">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">About this Equipment</h3>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              This {item.name} is a high-performance {item.category} designed for maximum efficiency in medium to large scale farms. 
              Maintained in pristine condition by {item.ownerName}, it features advanced {item.fuelType} technology ensuring lower operational costs. 
              The {item.year} model comes with optimized {item.specifications[0]?.key || 'performance'} settings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Regularly Serviced',
                'Insurance Covered',
                'Free Operator available (Optional)',
                'Low Fuel Consumption',
                'Verified Performance History',
                'Quick Support'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="text-gray-700 font-bold">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Booking Form */}
        <div className="lg:col-span-5 relative">
          <BookingForm 
            machinery={item} 
            onSuccess={(booking) => navigate('/rental/bookings')} 
          />
        </div>
      </div>
    </div>
  );
};
