import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  ThermometerSnowflake, 
  ThermometerSun,
  MapPin,
  Bell,
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const WeatherAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching alerts or from weather API
    setTimeout(() => {
      setAlerts([
        { 
          id: '1', 
          type: 'Storm', 
          severity: 'Critical', 
          message: 'Severe thunderstorm expected in your area between 4 PM and 8 PM. Secure loose equipment.', 
          timestamp: new Date().toISOString(),
          location: 'Punjab District A'
        },
        { 
          id: '2', 
          type: 'Rain', 
          severity: 'High', 
          message: 'Heavy rainfall expected tonight. Ensure proper drainage in Field B.', 
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: 'Punjab District A'
        },
        { 
          id: '3', 
          type: 'Heatwave', 
          severity: 'Medium', 
          message: 'High temperatures predicted for tomorrow. Increase irrigation frequency for wheat crops.', 
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          location: 'All Districts'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-100 text-red-700';
      case 'High': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-50 border-yellow-100 text-yellow-700';
      default: return 'bg-blue-50 border-blue-100 text-blue-700';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Storm': return <Zap className="w-6 h-6" />;
      case 'Rain': return <CloudRain className="w-6 h-6" />;
      case 'Heatwave': return <ThermometerSun className="w-6 h-6" />;
      case 'Coldwave': return <ThermometerSnowflake className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-100">
            <Bell className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Weather Alerts</h1>
          <p className="text-gray-500 mt-2">Stay informed about environmental risks to your farm</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['All', 'Critical', 'Warnings', 'Advisories'].map((tab, i) => (
            <button key={i} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              i === 0 ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-400 border border-gray-100'
            }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-6">
          {alerts.map((alert, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={alert.id} 
              className={`rounded-[32px] border-2 p-8 relative overflow-hidden ${getSeverityStyles(alert.severity)}`}
            >
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="w-14 h-14 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/40 rounded-full">
                      {alert.severity} Severity
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-2">{alert.type} Warning</h3>
                  <p className="font-medium text-lg leading-relaxed mb-6">
                    {alert.message}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-black/5">
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                      <MapPin className="w-4 h-4" /> {alert.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                      <Calendar className="w-4 h-4" /> {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-black/10 hover:bg-black/20 text-current border-none font-black text-xs py-4 px-6 rounded-2xl">
                    View Impact
                  </Button>
                  <Button className="bg-white text-gray-900 border-none font-black text-xs py-4 px-6 rounded-2xl shadow-sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mt-12 bg-[#1B5E20] rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <CheckCircle2 className="w-32 h-32" />
          </div>
          <h3 className="text-2xl font-black mb-6 relative z-10">AI Safety Checklist</h3>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {[
              "Deploy portable moisture sensors in lower fields",
              "Schedule emergency irrigation for dry patches",
              "Check drainage outlets for potential blockage",
              "Update weather fallback protocol for field staff"
            ].map((check, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-sm font-medium">{check}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
