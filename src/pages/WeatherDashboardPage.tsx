import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  ArrowDown, 
  ArrowUp,
  AlertTriangle,
  MapPin,
  RefreshCcw,
  Sunrise,
  Sunset,
  CloudLightning,
  CloudSnow
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Button } from '../components/ui/Button';

export const WeatherDashboardPage: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.2090 }); // Default New Delhi

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Using Open-Meteo free API (No API key required)
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`);
      const rawData = await res.json();
      
      const getCondition = (code: number) => {
        if (code <= 3) return code === 0 ? "Sunny" : "Cloud";
        if (code >= 51 && code <= 67) return "Rain";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 95) return "Storm";
        return "Cloud";
      };

      const currentCondition = getCondition(rawData.current.weather_code);
      
      const locName = 
        location.lat === 28.6139 ? "New Delhi, India" : 
        location.lat === 19.0760 ? "Mumbai, India" : 
        location.lat === 51.5074 ? "London, UK" : 
        "My Location";

      const mappedData = {
        lat: location.lat,
        lon: location.lon,
        location: locName,
        condition: currentCondition,
        temp: Math.round(rawData.current.temperature_2m),
        humidity: Math.round(rawData.current.relative_humidity_2m),
        windSpeed: Math.round(rawData.current.wind_speed_10m),
        rainProbability: rawData.daily.precipitation_probability_max[0] || 0,
        sunrise: new Date(rawData.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        sunset: new Date(rawData.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        forecast: {
          hourly: rawData.hourly.time.slice(0, 24).filter((_: any, i: number) => i % 3 === 0).map((t: string, i: number) => ({
            time: new Date(t).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            temp: Math.round(rawData.hourly.temperature_2m[i * 3]),
            condition: getCondition(rawData.hourly.weather_code[i * 3])
          })).slice(0, 4),
          weekly: rawData.daily.time.slice(0, 7).map((t: string, i: number) => ({
            day: new Date(t).toLocaleDateString('en-US', {weekday: 'short'}),
            temp: Math.round(rawData.daily.temperature_2m_max[i])
          }))
        },
        alerts: rawData.daily.precipitation_probability_max[0] > 70 
          ? [{ type: "Heavy Rain", severity: "High", message: "High probability of rain today. Ensure proper drainage." }] 
          : currentCondition === 'Sunny' && Math.round(rawData.current.temperature_2m) > 35
          ? [{ type: "Heat Wave", severity: "Medium", message: "High temperature detected. Increase irrigation." }]
          : [],
        farmingAdvice: currentCondition === 'Rain' 
          ? ["Delay pesticide spray", "Ensure drainage is clear", "Protect sensitive crops"] 
          : ["Optimal conditions for normal operations", "Monitor soil moisture"]
      };
      
      setWeather(mappedData);
    } catch (err) {
      console.error("Failed to fetch weather", err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          setLoading(false);
          alert("Could not get your location. Showing default.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const getWeatherIcon = (condition: string) => {
    const c = (condition || '').toLowerCase();
    const iconProps = {
      initial: { scale: 0.8, rotate: -10 },
      animate: { scale: 1, rotate: 0 },
      transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" as const, repeatDelay: 1 }
    };

    if (c.includes('rain')) return (
      <motion.div {...iconProps}>
        <CloudRain className="w-12 h-12 text-blue-400" />
      </motion.div>
    );
    if (c.includes('storm')) return (
      <motion.div {...iconProps}>
        <CloudLightning className="w-12 h-12 text-purple-400" />
      </motion.div>
    );
    if (c.includes('snow')) return (
      <motion.div {...iconProps}>
        <CloudSnow className="w-12 h-12 text-blue-100" />
      </motion.div>
    );
    if (c.includes('cloud')) return (
      <motion.div {...iconProps}>
        <Cloud className="w-12 h-12 text-gray-400" />
      </motion.div>
    );
    return (
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Sun className="w-12 h-12 text-yellow-400" />
      </motion.div>
    );
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-50 rounded-[48px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-50 rounded-[32px]" />
              <div className="h-48 bg-gray-50 rounded-[32px]" />
              <div className="h-48 bg-gray-50 rounded-[32px]" />
            </div>
            <div className="h-96 bg-gray-50 rounded-[48px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-12 transition-all duration-1000 relative overflow-hidden ${
      weather?.condition?.toLowerCase()?.includes('rain') ? 'bg-slate-900 text-white' :
      weather?.condition?.toLowerCase()?.includes('storm') ? 'bg-indigo-950 text-white' :
      weather?.condition?.toLowerCase()?.includes('cloud') ? 'bg-slate-50' : 'bg-blue-50'
    }`}>
      {/* Background Animated Elements */}
      <AnimatePresence>
        {weather?.condition?.toLowerCase()?.includes('rain') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-12 bg-blue-400/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 1000],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.5 + Math.random(),
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2E7D32] font-bold mb-1">
              <MapPin className="w-4 h-4" />
              {weather?.location || 'New Delhi, India'}
            </div>
            <h1 className={`text-4xl font-black ${weather?.condition?.toLowerCase()?.includes('rain') || weather?.condition?.toLowerCase()?.includes('storm') ? 'text-white' : 'text-gray-900'}`}>Weather Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-white" onClick={fetchWeather}>
              <RefreshCcw className="w-4 h-4" /> Refresh
            </Button>
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]" onClick={getUserLocation}>
              Use My Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className={`rounded-[48px] p-8 md:p-12 shadow-xl border relative overflow-hidden ${
              weather?.condition?.toLowerCase()?.includes('rain') || weather?.condition?.toLowerCase()?.includes('storm') 
              ? 'bg-white/10 backdrop-blur-xl border-white/20 text-white' 
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
              <div className="absolute top-0 right-0 p-12 opacity-10">
                {weather && getWeatherIcon(weather.condition)}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-end gap-2 mb-8">
                  <span className={`text-8xl font-black tracking-tighter ${
                    weather?.condition?.toLowerCase()?.includes('rain') || weather?.condition?.toLowerCase()?.includes('storm') ? 'text-white' : 'text-gray-900'
                  }`}>{weather?.temp}°</span>
                  <span className="text-2xl font-bold text-gray-400 mb-4">C</span>
                </div>
                
                <div className="flex flex-wrap gap-8 mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Humidity</p>
                      <p className="text-xl font-black">{weather?.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                      <Wind className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wind Speed</p>
                      <p className="text-xl font-black">{weather?.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                      <CloudRain className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rain Prob.</p>
                      <p className="text-xl font-black">{weather?.rainProbability}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {weather?.forecast?.hourly?.slice(0, 4)?.map((h: any, i: number) => (
                    <div key={i} className={`p-4 rounded-3xl border text-center transition-colors ${
                      weather?.condition?.toLowerCase()?.includes('rain') || weather?.condition?.toLowerCase()?.includes('storm')
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-gray-50 border-gray-100 hover:bg-green-50'
                    }`}>
                      <p className="text-xs font-bold text-gray-400 mb-2">{h.time}</p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(h.condition)}
                      </div>
                      <p className="text-xl font-black">{h.temp}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Charts */}
            <div className={`rounded-[40px] p-8 shadow-xl border ${
              weather?.condition?.toLowerCase()?.includes('rain') || weather?.condition?.toLowerCase()?.includes('storm')
              ? 'bg-white/10 backdrop-blur-xl border-white/20 text-white'
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
              <h3 className="text-2xl font-black mb-8">Temperature Trends</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weather?.forecast?.weekly}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#999'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#999'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#2E7D32" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Alerts */}
            {weather?.alerts?.length > 0 && (
              <div className="space-y-4">
                {weather.alerts.map((alert: any, i: number) => (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={i} 
                    className={`p-6 rounded-3xl border-2 flex gap-4 ${
                      alert.severity === 'High' ? 'bg-red-50 border-red-100 text-red-700' : 
                      'bg-orange-50 border-orange-100 text-orange-700'
                    }`}
                  >
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest mb-1">{alert.type} Alert</h4>
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* AI Farming Advice */}
            <div className="bg-[#1B5E20] rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CloudRain className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-black mb-6 relative z-10">AI Farming Advice</h3>
              <div className="space-y-4 relative z-10">
                {weather?.farmingAdvice?.map((advice: string, i: number) => (
                  <div key={i} className="flex gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{advice}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-8 bg-white text-[#1B5E20] hover:bg-gray-100 font-bold py-6">
                Full Weekly Plan
              </Button>
            </div>

            {/* Sunrise/Sunset */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sunrise className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sunrise</p>
                <p className="text-xl font-black">{weather?.sunrise || '05:32 AM'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sunset className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sunset</p>
                <p className="text-xl font-black">{weather?.sunset || '07:15 PM'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
