import React from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Bell, Shield, User, Smartphone, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SmartFarmingSettings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-green-600" />
          System Settings
        </h1>
        <p className="text-gray-500 font-medium">Configure your smart farming system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'general', icon: Settings, label: 'General Settings' },
            { id: 'profile', icon: User, label: 'Profile & Account' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'devices', icon: Smartphone, label: 'Connected Devices' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'localization', icon: Globe, label: 'Localization' }
          ].map((tab, i) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                i === 0 ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Farm Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Farm Name</label>
                  <input 
                    type="text" 
                    defaultValue="Green Acres Farm"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Area (Acres)</label>
                    <input 
                      type="number" 
                      defaultValue="150"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Crop Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                      <option>Wheat</option>
                      <option>Corn</option>
                      <option>Soybeans</option>
                      <option>Mixed Vegetables</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-4">System Units</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Temperature</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                    <option>Celsius (°C)</option>
                    <option>Fahrenheit (°F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Distance/Speed</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                    <option>Kilometers (km, km/h)</option>
                    <option>Miles (mi, mph)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <Button className="gap-2 px-8">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
