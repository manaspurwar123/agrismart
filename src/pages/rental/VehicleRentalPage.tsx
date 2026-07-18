import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Truck, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Zap,
  Package,
  Fuel,
  Plus,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Machinery } from '../../types';
import { cn } from '../../lib/utils';

export const VehicleRentalPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Vehicles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    category: 'Pickup Truck',
    dailyPrice: '',
    fuelType: 'Diesel',
    capacity: '1.5 Ton',
    description: '',
    image: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/machinery?type=Vehicle');
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await fetch(`/api/machinery/${id}`, {
        method: 'DELETE'
      });
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryImgMap: Record<string, string> = {
        'pickup truck': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'mini truck': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
        'tempo': 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800',
        'water tanker': 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800',
        'refrigerated': 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be?w=800'
      };

      const finalImg = newVehicle.image || categoryImgMap[newVehicle.category.toLowerCase()] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800';

      const body = {
        name: newVehicle.name,
        brand: 'Tata',
        model: 'Ace Gold',
        year: 2023,
        type: 'Vehicle',
        category: newVehicle.category,
        images: [finalImg],
        specifications: [
          { key: 'Payload', value: newVehicle.capacity },
          { key: 'Engine', value: '700 cc' }
        ],
        workingCapacity: newVehicle.capacity,
        capacity: newVehicle.capacity,
        fuelConsumption: '22 km/l',
        fuelType: newVehicle.fuelType as any,
        dailyPrice: Number(newVehicle.dailyPrice) || 1500,
        hourlyPrice: Math.round((Number(newVehicle.dailyPrice) || 1500) / 8),
        weeklyPrice: (Number(newVehicle.dailyPrice) || 1500) * 6,
        monthlyPrice: (Number(newVehicle.dailyPrice) || 1500) * 22,
        availability: true,
        rating: 5.0,
        reviewsCount: 1,
        distance: '3.5 km',
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
        setVehicles(prev => [added, ...prev]);
        setShowAddModal(false);
        setNewVehicle({
          name: '',
          category: 'Pickup Truck',
          dailyPrice: '',
          fuelType: 'Diesel',
          capacity: '1.5 Ton',
          description: '',
          image: ''
        });
      } else {
        // Fallback for demo mode
        const mockAdded: Machinery = {
          id: 'v-' + Math.random().toString(36).substring(2, 9),
          ownerId: 'user-1',
          ownerName: 'manas',
          name: newVehicle.name,
          brand: 'Tata',
          model: 'Ace Gold',
          year: 2023,
          type: 'Vehicle',
          category: newVehicle.category,
          images: [finalImg],
          specifications: [
            { key: 'Payload', value: newVehicle.capacity },
            { key: 'Engine', value: '700 cc' }
          ],
          workingCapacity: newVehicle.capacity,
          capacity: newVehicle.capacity,
          fuelConsumption: '22 km/l',
          fuelType: newVehicle.fuelType as any,
          dailyPrice: Number(newVehicle.dailyPrice) || 1500,
          hourlyPrice: Math.round((Number(newVehicle.dailyPrice) || 1500) / 8),
          weeklyPrice: (Number(newVehicle.dailyPrice) || 1500) * 6,
          monthlyPrice: (Number(newVehicle.dailyPrice) || 1500) * 22,
          availability: true,
          rating: 5.0,
          reviewsCount: 1,
          distance: '3.5 km',
          location: {
            lat: 19.9975,
            lng: 73.7898,
            address: 'Sinnar, Nashik, Maharashtra'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setVehicles(prev => [mockAdded, ...prev]);
        setShowAddModal(false);
        setNewVehicle({
          name: '',
          category: 'Pickup Truck',
          dailyPrice: '',
          fuelType: 'Diesel',
          capacity: '1.5 Ton',
          description: '',
          image: ''
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error listing vehicle');
    }
  };

  const filteredItems = vehicles.filter(v => {
    const matchesSearch = (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Vehicles' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = [
    { name: 'Pickup Truck' },
    { name: 'Mini Truck' },
    { name: 'Tempo' },
    { name: 'Water Tanker' },
    { name: 'Refrigerated' }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-blue-700 uppercase tracking-[0.2em] mb-4 block">Logistics & Transport</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Vehicle Rental.</h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl">
            Reliable transport solutions for your harvest. From mini trucks to heavy-duty trailers.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { name: 'All Vehicles', icon: Truck },
          { name: 'Pickup Truck', icon: Truck },
          { name: 'Mini Truck', icon: Truck },
          { name: 'Tempo', icon: Truck },
          { name: 'Water Tanker', icon: Truck },
          { name: 'Refrigerated', icon: ShieldCheck },
        ].map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 border rounded-2xl whitespace-nowrap font-bold transition-all shadow-sm",
              selectedCategory === cat.name 
                ? "bg-blue-600 text-white border-blue-600 scale-105" 
                : "bg-white border-gray-100 text-gray-600 hover:border-blue-500 hover:text-blue-700"
            )}
          >
            <cat.icon className="w-5 h-5" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Filter & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for pickup trucks, tankers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-6 py-5 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
            <option>All Capacities</option>
            <option>0-1 Ton</option>
            <option>1-5 Ton</option>
            <option>5+ Ton</option>
          </select>
          <button className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 h-[500px] rounded-[40px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col group"
            >
              <div className="relative h-64">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2 items-center">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current" />
                    Verified Provider
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVehicle(item.id);
                    }}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-all"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span className="text-xs font-black">{item.rating}</span>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                    <span className="text-sm font-bold text-gray-400">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{item.location.address} • {item.distance}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Package className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-sm font-bold text-gray-900">{item.capacity || '1.5 Ton'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Fuel className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel</p>
                    <p className="text-sm font-bold text-gray-900">{item.fuelType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-orange-600" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Year</p>
                    <p className="text-sm font-bold text-gray-900">{item.year}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Rental Starts At</p>
                    <p className="text-2xl font-black text-gray-900">₹{item.dailyPrice}<span className="text-sm text-gray-400">/day</span></p>
                  </div>
                  <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate(`/rental/equipment/${item.id}`)}
                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-95"
                  >
                    View Details
                  </button>
                  <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95">
                    Contact Owner
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
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
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">List Your Vehicle</h3>
                  <p className="text-gray-500 font-medium">Earn money by renting out transport vehicles</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 hover:text-gray-900 transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddVehicleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Vehicle Name</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Tata Ace Gold"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select 
                      value={newVehicle.category}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-medium"
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
                      value={newVehicle.dailyPrice}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, dailyPrice: e.target.value }))}
                      placeholder="e.g., 1800"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Fuel Type</label>
                    <select 
                      value={newVehicle.fuelType}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Load Capacity</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="e.g., 1.5 Ton"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image URL (Optional)</label>
                    <input 
                      type="url"
                      value={newVehicle.image}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Leave blank for auto-selected vehicle image"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Vehicle Description</label>
                  <textarea 
                    value={newVehicle.description}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe vehicle condition, driver options, delivery terms, etc..."
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
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
