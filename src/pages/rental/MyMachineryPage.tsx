import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar, 
  Wrench, 
  AlertTriangle,
  ChevronRight,
  Star,
  Zap,
  Truck,
  Trash2
} from 'lucide-react';
import { Machinery } from '../../types';
import { cn } from '../../lib/utils';

export const MyMachineryPage: React.FC = () => {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchMyMachinery();
  }, []);

  const fetchMyMachinery = async () => {
    try {
      const res = await fetch('/api/machinery?ownerId=current_user'); // Assuming backend filters by user
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
        // Fallback for demo / permissions issues
        const mockAdded: Machinery = {
          id: 'm-' + Math.random().toString(36).substring(2, 9),
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

  const categoriesList = [
    { name: 'Tractor' },
    { name: 'Harvester' },
    { name: 'Rotavator' },
    { name: 'Seeder' },
    { name: 'Sprayer' },
    { name: 'Irrigation Pump' },
    { name: 'Drone Sprayer' }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-blue-700 uppercase tracking-[0.2em] mb-4 block">Fleet Management</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">My Equipment.</h1>
          <p className="text-xl text-gray-500 font-medium">Manage your equipment fleet and track rental performance.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Fleet', value: machinery.length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Currently Rented', value: '3', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Earnings', value: '₹45,800', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-[400px] bg-gray-100 rounded-[48px] animate-pulse" />)
        ) : (
          machinery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border",
                    item.availability ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                  )}>
                    {item.availability ? 'Available for Rent' : 'Currently Rented'}
                  </span>
                  <button 
                    onClick={() => handleDeleteMachinery(item.id)}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-all"
                    title="Delete Equipment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-black text-white tracking-tight">{item.name}</h3>
                  <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">{item.category} • Model {item.year}</p>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price/Day</p>
                    <p className="text-xl font-black text-gray-900">₹{item.dailyPrice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</p>
                    <p className="text-xl font-black text-gray-900">12</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Earned</p>
                    <p className="text-xl font-black text-green-700">₹14,500</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest mb-2">
                    <span className="text-gray-400">Health Status</span>
                    <span className="text-green-600">Excellent</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[94%]" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-50">
                  <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Details
                  </button>
                  <button className="flex-1 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Manage Availability
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

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
                      {categoriesList.map((cat, idx) => (
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
                      placeholder="Leave blank for auto-selected gear image"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Equipment Description</label>
                  <textarea 
                    value={newMachinery.description}
                    onChange={(e) => setNewMachinery(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe condition, year, attachments included, or delivery options..."
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
                    className="w-1/2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all"
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
