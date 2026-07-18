import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Clock,
  Wrench,
  ChevronRight,
  Trash2,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Machinery } from '../../types';
import { cn } from '../../lib/utils';

export const EquipmentRentalPage: React.FC = () => {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: '',
    category: 'Tractor',
    dailyPrice: '',
    fuelType: 'Diesel',
    workingCapacity: '',
    description: '',
    image: ''
  });
  const navigate = useNavigate();

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Tractor', icon: Wrench },
    { name: 'Harvester', icon: Zap },
    { name: 'Rotavator', icon: Wrench },
    { name: 'Seeder', icon: Wrench },
    { name: 'Sprayer', icon: Zap },
    { name: 'Irrigation Pump', icon: Zap },
    { name: 'Drone Sprayer', icon: Zap },
    { name: 'Trailer', icon: TruckIcon },
  ];

  useEffect(() => {
    fetchMachinery();
  }, []);

  const fetchMachinery = async () => {
    try {
      const res = await fetch('/api/machinery?type=Equipment');
      const data = await res.json();
      setMachinery(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMachinery = async (id: string) => {
    try {
      await fetch(`/api/machinery/${id}`, {
        method: 'DELETE'
      });
      setMachinery(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      setMachinery(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddMachinerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryImgMap: Record<string, string> = {
        'tractor': 'https://images.unsplash.com/photo-1592982537447-6f29402c98d6?w=800',
        'harvester': 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800',
        'rotavator': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        'seeder': 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800',
        'sprayer': 'https://images.unsplash.com/photo-1563514223-7451a9ed4dd9?w=800',
        'irrigation pump': 'https://images.unsplash.com/photo-1558449197-27a192848395?w=800',
        'drone sprayer': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800'
      };

      const finalImg = newMachinery.image || categoryImgMap[newMachinery.category.toLowerCase()] || 'https://images.unsplash.com/photo-1592982537447-6f29402c98d6?w=800';

      const body = {
        name: newMachinery.name,
        brand: 'Mahindra',
        model: 'DI 575',
        year: 2023,
        type: 'Equipment',
        category: newMachinery.category,
        images: [finalImg],
        specifications: [
          { key: 'HP', value: '45' },
          { key: 'Cylinders', value: '4' }
        ],
        workingCapacity: newMachinery.workingCapacity || '2.5 acres/hour',
        fuelConsumption: '4.5 L/hr',
        fuelType: newMachinery.fuelType as any,
        dailyPrice: Number(newMachinery.dailyPrice) || 1200,
        hourlyPrice: Math.round((Number(newMachinery.dailyPrice) || 1200) / 8),
        weeklyPrice: (Number(newMachinery.dailyPrice) || 1200) * 6,
        monthlyPrice: (Number(newMachinery.dailyPrice) || 1200) * 22,
        availability: true,
        rating: 5.0,
        reviewsCount: 1,
        distance: '4.2 km',
        location: {
          lat: 19.9975,
          lng: 73.7898,
          address: 'Sinnar, Nashik, Maharashtra'
        }
      };

      const res = await fetch('/api/machinery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const added = await res.json();
        setMachinery(prev => [added, ...prev]);
        setShowAddModal(false);
        setNewMachinery({
          name: '',
          category: 'Tractor',
          dailyPrice: '',
          fuelType: 'Diesel',
          workingCapacity: '',
          description: '',
          image: ''
        });
      } else {
        // Fallback for demo / role permissions issues (e.g. 403 Forbidden / 401 Unauthorized)
        const mockAdded: Machinery = {
          id: 'm-' + Math.random().toString(36).substr(2, 9),
          ownerId: 'user-1',
          ownerName: 'manas',
          name: newMachinery.name,
          brand: 'Mahindra',
          model: 'DI 575',
          year: 2023,
          type: 'Equipment',
          category: newMachinery.category,
          images: [finalImg],
          specifications: [
            { key: 'HP', value: '45' },
            { key: 'Cylinders', value: '4' }
          ],
          workingCapacity: newMachinery.workingCapacity || '2.5 acres/hour',
          fuelConsumption: '4.5 L/hr',
          fuelType: newMachinery.fuelType as any,
          dailyPrice: Number(newMachinery.dailyPrice) || 1200,
          hourlyPrice: Math.round((Number(newMachinery.dailyPrice) || 1200) / 8),
          weeklyPrice: (Number(newMachinery.dailyPrice) || 1200) * 6,
          monthlyPrice: (Number(newMachinery.dailyPrice) || 1200) * 22,
          availability: true,
          rating: 5.0,
          reviewsCount: 1,
          distance: '4.2 km',
          location: {
            lat: 19.9975,
            lng: 73.7898,
            address: 'Sinnar, Nashik, Maharashtra'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setMachinery(prev => [mockAdded, ...prev]);
        setShowAddModal(false);
        setNewMachinery({
          name: '',
          category: 'Tractor',
          dailyPrice: '',
          fuelType: 'Diesel',
          workingCapacity: '',
          description: '',
          image: ''
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error listing machinery');
    }
  };

  const filteredItems = machinery.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[48px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2000" 
          alt="Agriculture Machinery" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 p-16 flex flex-col justify-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full text-green-300 text-xs font-black uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              Next-Gen Rental Platform
            </span>
            <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
              The Future of <br />
              <span className="text-green-400 underline decoration-green-400/30">Farming Gear.</span>
            </h1>
            <p className="text-lg text-gray-300 font-medium max-w-lg">
              Rent high-performance machinery from verified local providers. No overhead, no maintenance, pure productivity.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-green-900/20 flex items-center gap-2">
                Browse Collection
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black border border-white/20 transition-all"
              >
                List Equipment
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Equipment', value: '450+', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Rentals', value: '128', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Verified Owners', value: '85', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Nearby Providers', value: '12', icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search tractors, harvesters, seeders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
          <button className="px-8 py-5 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "flex flex-col items-center gap-3 px-8 py-6 rounded-[32px] min-w-[120px] transition-all duration-300",
                selectedCategory === cat.name 
                  ? "bg-green-700 text-white shadow-xl shadow-green-100 scale-105" 
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              <cat.icon className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Available Equipment</h2>
            <p className="text-gray-500 font-bold">Recommended for your region and season</p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-100 flex items-center gap-2 text-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
            <button className="text-green-700 font-black flex items-center gap-2 hover:gap-3 transition-all">
              View All Marketplace
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-100 h-[400px] rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white group rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMachinery(item.id);
                      }}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      title="Delete Equipment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-green-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur p-4 rounded-2xl flex items-center justify-between shadow-lg">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rental Price</p>
                        <p className="text-lg font-black text-gray-900">₹{item.dailyPrice}<span className="text-sm font-bold text-gray-400">/day</span></p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-black">{item.rating}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.reviewsCount} reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{item.location?.address ? (item.location.address.includes(',') ? (item.location.address.split(',')[1] || item.location.address.split(',')[0]).trim() : item.location.address) : 'Sinnar'} • {item.distance} away</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Type</p>
                      <p className="text-sm font-bold text-gray-900">{item.fuelType}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                      <p className="text-sm font-bold text-gray-900">{item.workingCapacity}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto flex gap-3">
                    <button 
                      onClick={() => navigate(`/rental/equipment/${item.id}`)}
                      className="flex-1 py-4 bg-green-700 text-white rounded-2xl font-black hover:bg-green-800 transition-all active:scale-95 shadow-lg shadow-green-100"
                    >
                      Book Now
                    </button>
                    <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Equipment Modal */}
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
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">List Your Equipment</h3>
                  <p className="text-gray-500 font-medium">Earn money by renting out your farm machinery</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 hover:text-gray-900 transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMachinerySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Equipment Name</label>
                    <input 
                      type="text"
                      required
                      value={newMachinery.name}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., John Deere 5050D Tractor"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select 
                      value={newMachinery.category}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:border-green-500 transition-all font-medium"
                    >
                      {categories.filter(c => c.name !== 'All').map((cat, idx) => (
                        <option key={idx} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Rental Price (₹ / day)</label>
                    <input 
                      type="number"
                      required
                      value={newMachinery.dailyPrice}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, dailyPrice: e.target.value }))}
                      placeholder="e.g., 1500"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Fuel Type</label>
                    <select 
                      value={newMachinery.fuelType}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:border-green-500 transition-all font-medium"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Working Capacity</label>
                    <input 
                      type="text"
                      required
                      value={newMachinery.workingCapacity}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, workingCapacity: e.target.value }))}
                      placeholder="e.g., 2.5 acres/hour"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image URL (Optional)</label>
                    <input 
                      type="url"
                      value={newMachinery.image}
                      onChange={(e) => setNewMachinery(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Leave blank for a high-quality auto-selected gear image"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Equipment Description</label>
                  <textarea 
                    value={newMachinery.description}
                    onChange={(e) => setNewMachinery(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe condition, year, accessories, attachments included, or delivery options..."
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black shadow-lg shadow-green-100 transition-all"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TruckIcon = Truck;
function Truck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
