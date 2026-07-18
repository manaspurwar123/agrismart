import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, Phone, ShieldAlert, HeartPulse, Flame, Droplets, MapPin, CheckCircle2 } from 'lucide-react';

export function EmergencyModule() {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const emergencyContacts = [
    { name: 'Local Fire Department', number: '101', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Medical Emergency', number: '108', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Police Assistance', number: '100', icon: ShieldAlert, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Poison Control / Agri Chem', number: '1-800-222-1222', icon: AlertOctagon, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Irrigation / Flood Control', number: 'Local Office', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const triggerAlert = (type: string) => {
    setActiveAlert(type);
    // In a real app, this would send an SMS/Email via backend or push notification to all workers
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <AlertOctagon className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Emergency Response</h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Quick access to emergency services and farm-wide alert broadcasts.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Broadcast Farm Alert</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'fire', label: 'Fire on Farm', icon: Flame, color: 'bg-red-500', hover: 'hover:bg-red-600' },
            { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'bg-rose-500', hover: 'hover:bg-rose-600' },
            { id: 'chemical', label: 'Chemical Spill', icon: AlertOctagon, color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
            { id: 'security', label: 'Security Breach', icon: ShieldAlert, color: 'bg-gray-800', hover: 'hover:bg-gray-900' },
          ].map((alert) => (
            <button
              key={alert.id}
              onClick={() => triggerAlert(alert.label)}
              className={`p-6 rounded-2xl text-white shadow-lg flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 ${alert.color} ${alert.hover} shadow-${alert.color.replace('bg-', '')}/30`}
            >
              <alert.icon className="w-8 h-8" />
              <span className="font-bold text-center leading-tight">{alert.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Dial Contacts</h2>
          <div className="space-y-4">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contact.bg}`}>
                    <contact.icon className={`w-6 h-6 ${contact.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{contact.name}</h3>
                    <p className="text-sm font-medium text-gray-500">{contact.number}</p>
                  </div>
                </div>
                <a href={`tel:${contact.number}`} className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm group-hover:border-green-200">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <MapPin className="w-64 h-64" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Location Sharing</h2>
          <p className="text-gray-600 mb-6">In an emergency, precise location details are critical for first responders.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <p className="text-sm text-blue-800 font-bold mb-2">Current Coordinates (GPS)</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl text-blue-900 tracking-wider">20°35'37.3"N 78°57'46.4"E</span>
              <button className="text-sm bg-white px-4 py-2 rounded-lg font-bold text-blue-600 shadow-sm hover:shadow-md transition-shadow">Copy</button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <p className="text-sm text-gray-600 font-bold mb-2">Primary Access Gate</p>
            <p className="text-lg font-bold text-gray-900">North Gate 2 - State Highway 44</p>
            <p className="text-sm text-gray-500 mt-1">Gate Code: 8421#</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeAlert && (
          <div className="fixed inset-0 bg-red-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl relative"
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase text-red-600">{activeAlert} Alert Broadcasted</h2>
              <p className="text-gray-600 font-medium text-lg mb-8">
                All farm personnel and connected devices have been notified. Please move to the designated safe zones immediately.
              </p>
              <button
                onClick={() => setActiveAlert(null)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors text-lg"
              >
                Acknowledge & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
