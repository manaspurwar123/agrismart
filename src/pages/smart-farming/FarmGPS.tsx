import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Plus, Edit2, Trash2, Crosshair, Navigation } from 'lucide-react';

// Fix for default leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FarmLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area: number;
  crop: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function FarmGPS() {
  const [farms, setFarms] = useState<FarmLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to India
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', lat: 0, lng: 0, area: 0, crop: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFarms();
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const fetchFarms = async () => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockFarms = [
        { id: '1', name: 'North Plot', lat: 28.6139, lng: 77.2090, area: 5.5, crop: 'Wheat' },
        { id: '2', name: 'East Plot', lat: 28.6150, lng: 77.2100, area: 3.2, crop: 'Corn' }
      ];
      setFarms(mockFarms);
      if (mockFarms.length > 0) setCenter([mockFarms[0].lat, mockFarms[0].lng]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        setFarms(farms.map(f => f.id === editingId ? { ...f, ...formData } : f));
      } else {
        setFarms([...farms, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', lat: 0, lng: 0, area: 0, crop: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this farm location?')) return;
    try {
      setFarms(farms.filter(f => f.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (farm: FarmLocation) => {
    setEditingId(farm.id);
    setFormData({ name: farm.name, lat: farm.lat, lng: farm.lng, area: farm.area, crop: farm.crop });
    setIsAdding(true);
    setCenter([farm.lat, farm.lng]);
  };

  const focusFarm = (farm: FarmLocation) => {
    setCenter([farm.lat, farm.lng]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Farm GPS Tracking</h1>
          <p className="text-gray-500 font-medium">Manage and track your farm locations interactively.</p>
        </div>
        <button 
          onClick={() => {
             setIsAdding(true);
             setEditingId(null);
             setFormData({ name: '', lat: center[0], lng: center[1], area: 0, crop: '' });
          }}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Farm
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-green-600" /> My Farms
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading locations...</p>
            ) : farms.length === 0 ? (
              <p className="text-gray-500 text-sm">No farms added yet. Click 'Add Farm' to start.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {farms.map(farm => (
                  <div key={farm.id} className="p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer group" onClick={() => focusFarm(farm)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{farm.name}</h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(farm); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(farm.id); }} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                      <span className="px-2 py-1 bg-white rounded-md border border-gray-100">{farm.area} Acres</span>
                      <span className="px-2 py-1 bg-white rounded-md border border-gray-100">{farm.crop}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 h-[600px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={center} />
            {farms.map(farm => (
              <Marker key={farm.id} position={[farm.lat, farm.lng]}>
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-600">{farm.area} Acres - {farm.crop}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Farm' : 'Add New Farm'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                    <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                    <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
                  </div>
                </div>
                <button type="button" onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(pos => {
                      setFormData({...formData, lat: pos.coords.latitude, lng: pos.coords.longitude});
                    });
                  }
                }} className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-all">
                  <Crosshair className="w-4 h-4" /> Use Current Location
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Area (Acres)</label>
                    <input required type="number" value={formData.area} onChange={e => setFormData({...formData, area: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Crop</label>
                    <input required type="text" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all">Save Farm</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
