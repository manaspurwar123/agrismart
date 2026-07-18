import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Trash2, 
  Edit3, 
  Layers, 
  Navigation,
  Globe,
  Settings,
  MoreVertical,
  Activity,
  Droplets,
  CloudSun
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Farm } from '../types';

export const MyFarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: 28.6139,
    longitude: 77.2090,
    village: '',
    district: '',
    state: '',
    size: 5,
    crop: 'Wheat'
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockFarms: Farm[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Green Valley Estate',
          latitude: 28.6139,
          longitude: 77.2090,
          village: 'Karnal',
          district: 'Karnal',
          state: 'Haryana',
          size: 15,
          crop: 'Wheat',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user-1',
          name: 'Sunrise Orchards',
          latitude: 19.0760,
          longitude: 72.8777,
          village: 'Nashik',
          district: 'Nashik',
          state: 'Maharashtra',
          size: 8,
          crop: 'Grapes',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          userId: 'user-1',
          name: 'Riverfront Fields',
          latitude: 30.9009,
          longitude: 75.8572,
          village: 'Ludhiana',
          district: 'Ludhiana',
          state: 'Punjab',
          size: 20,
          crop: 'Rice',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setFarms(mockFarms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock adding farm
      const newFarm: Farm = {
        id: Math.random().toString(36).substring(2, 9),
        userId: 'user-1',
        name: formData.name,
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        size: Number(formData.size) || 0,
        crop: formData.crop,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFarms(prev => [...prev, newFarm]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this farm?')) return;
    try {
      setFarms(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Farms</h1>
            <p className="text-gray-500">Manage all your agricultural assets from one place</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 bg-white rounded-2xl">
              <Layers className="w-5 h-5" /> All Assets
            </Button>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2 px-8 py-6 rounded-[24px] text-lg"
            >
              <Plus className="w-6 h-6" /> Add New Farm
            </Button>
          </div>
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {farms.map((farm) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={farm.id} 
              className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100 group"
            >
              {/* Card Header/Map Preview */}
              <div className="h-48 bg-gray-200 relative group-hover:opacity-90 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white text-2xl font-black">{farm.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                    <MapPin className="w-3 h-3" /> {farm.village}, {farm.district}
                  </div>
                </div>
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border border-white/20">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(farm.id)}
                    className="bg-white/20 backdrop-blur-md hover:bg-red-500/40 text-white border border-white/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <img 
                  src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000`} 
                  alt="Farm"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Main Crop</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-[#2E7D32]" />
                      </div>
                      <p className="font-bold text-gray-800">{farm.crop}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Size</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="font-bold text-gray-800">{farm.size} Acres</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <CloudSun className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-bold text-gray-700">Weather Status</span>
                    </div>
                    <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-bold text-gray-700">Soil Moisture</span>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Good (24%)</span>
                  </div>
                </div>

                <Button className="w-full mt-8 bg-[#2E7D32] hover:bg-[#1B5E20] py-4 rounded-2xl gap-2 group-hover:shadow-lg transition-all">
                  <Navigation className="w-4 h-4" /> View Map & Insights
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {farms.length === 0 && !loading && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-[#2E7D32]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No farms found</h2>
            <p className="text-gray-500 mb-8">Start by adding your first farm to unlock AI insights.</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#2E7D32] px-8"
            >
              Add Your First Farm
            </Button>
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-2xl font-black">Add New Farm</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleAddFarm} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Farm Name</label>
                    <input 
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Green Valley Farm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Crop Type</label>
                    <input 
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      value={formData.crop}
                      onChange={(e) => setFormData({...formData, crop: e.target.value})}
                      placeholder="e.g. Wheat"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Size (Acres)</label>
                    <input 
                      required
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Village</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        value={formData.village}
                        onChange={(e) => setFormData({...formData, village: e.target.value})}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">District</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">State</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button className="md:col-span-2 bg-[#2E7D32] hover:bg-[#1B5E20] py-6 rounded-2xl text-lg font-black mt-4">
                    Save Farm Details
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
