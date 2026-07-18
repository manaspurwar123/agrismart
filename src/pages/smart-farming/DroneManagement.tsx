import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Battery, Crosshair, Wifi, AlertTriangle, Plus, Play, Pause, X, Settings } from 'lucide-react';

interface Drone {
  id: string;
  name: string;
  status: string; // 'idle', 'flying', 'maintenance'
  battery: number;
  connection: string;
  lastMission: string;
}

export function DroneManagement() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const res = await fetch('/api/drones');
      let data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        // Seed initial drones
        const initial = [
          { id: 'DRN-001', name: 'AgriHawk Alpha', status: 'idle', battery: 100, connection: 'Strong', lastMission: 'Crop Mapping - North Sector' },
          { id: 'DRN-002', name: 'AgriHawk Beta', status: 'flying', battery: 45, connection: 'Good', lastMission: 'Pesticide Spraying - Plot 4' },
        ];
        await Promise.all(initial.map(d => fetch('/api/drones', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(d)})));
        data = initial;
      }
      setDrones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDrone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const drone = {
        name: formData.name,
        status: 'idle',
        battery: 100,
        connection: 'Offline',
        lastMission: 'None'
      };
      await fetch('/api/drones', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(drone) });
      setIsAdding(false);
      setFormData({ name: '' });
      fetchDrones();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Drone Fleet Management</h1>
          <p className="text-gray-500 font-medium">Monitor and control your agricultural drones.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Register Drone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {drones.map(drone => (
          <motion.div
            key={drone.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col group relative overflow-hidden"
          >
            {drone.status === 'flying' && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 animate-pulse" />
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                drone.status === 'flying' ? 'bg-purple-100 text-purple-700' :
                drone.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {drone.status === 'flying' && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                {drone.status.toUpperCase()}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1">{drone.name}</h3>
            <p className="text-sm font-mono text-gray-500 mb-6">{drone.id}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                <Battery className={`w-5 h-5 ${drone.battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-xs text-gray-500 font-bold">Battery</p>
                  <p className="font-black text-gray-900">{drone.battery}%</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                <Wifi className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 font-bold">Signal</p>
                  <p className="font-black text-gray-900">{drone.connection}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-1">Last Mission</p>
              <p className="text-sm font-medium text-gray-900 truncate">{drone.lastMission}</p>
            </div>
            
            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {drone.status === 'idle' && (
                <button className="flex-1 py-2 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Start Mission
                </button>
              )}
              {drone.status === 'flying' && (
                <button className="flex-1 py-2 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" /> Return to Base
                </button>
              )}
              <button className="p-2 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Drone</h2>
              <form onSubmit={handleAddDrone} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Drone Name / Model</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none" placeholder="e.g. DJI Agras T40" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all">Register</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
