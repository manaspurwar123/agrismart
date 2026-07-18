import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { MapPin, Navigation, Truck, Package, Clock, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordinate dictionary for major Indian and global cities
const CITY_COORDS: Record<string, [number, number]> = {
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'agra': [27.1767, 78.0081],
  'mumbai': [19.0760, 72.8777],
  'pune': [18.5204, 73.8567],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'nashik': [19.9975, 73.7898],
  'jaipur': [26.9124, 75.7873],
  'hyderabad': [17.3850, 78.4867],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'lucknow': [26.8467, 80.9462],
  'patna': [25.5941, 85.1376],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'chandigarh': [30.7333, 76.7794],
  'ahmedabad': [23.0225, 72.5714],
  'wardha': [20.7453, 78.6022],
  'hinganghat': [20.5505, 78.8411],
  'nagpur': [21.1458, 79.0882],
};

// Map component updater to zoom and pan to route
function RouteMapUpdater({ path }: { path: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [path, map]);
  return null;
}

export function RoutePlanner() {
  const [start, setStart] = useState('delhi');
  const [end, setEnd] = useState('agra');
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Central India default

  // Geocode input string using dictionary lookup first, then fallback to OSM Nominatim free API
  const geocodeCity = async (name: string): Promise<[number, number] | null> => {
    const cleanName = name.trim().toLowerCase();
    if (CITY_COORDS[cleanName]) {
      return CITY_COORDS[cleanName];
    }
    try {
      // Nominatim search
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=3`);
      const data = await res.json();
      if (data && data.length > 0) {
        // Find first with valid lat/lon
        for (const item of data) {
          if (item.lat && item.lon) {
            return [parseFloat(item.lat), parseFloat(item.lon)];
          }
        }
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return null;
  };

  const calculateRoute = async () => {
    if (!start.trim() || !end.trim()) {
      setError('Please fill in both start and destination locations.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Geocode start and destination
      const startCoords = await geocodeCity(start);
      if (!startCoords) {
        setError(`Could not find location coordinates for "${start}". Please try a major city name.`);
        setLoading(false);
        return;
      }

      const endCoords = await geocodeCity(end);
      if (!endCoords) {
        setError(`Could not find location coordinates for "${end}". Please try a major city name.`);
        setLoading(false);
        return;
      }

      // Try to fetch real driving route from OSRM
      let routeCalculated = false;
      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const data = await res.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeData = data.routes[0];
          const distanceKm = routeData.distance / 1000;
          const durationMin = Math.round(routeData.duration / 60);
          
          const distanceStr = distanceKm.toFixed(1) + ' km';
          const durationStr = durationMin > 60 
            ? `${Math.floor(durationMin / 60)} hr ${durationMin % 60} mins` 
            : `${durationMin} mins`;
            
          // Estimate cost based on distance
          const fuelLiters = distanceKm / 15; // 15 km/l mileage
          const costStr = `₹${Math.round(fuelLiters * 102)}`; // ₹102 per liter average fuel price

          const pathPoints = routeData.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);

          setRoute({
            distance: distanceStr,
            duration: durationStr,
            cost: costStr,
            path: pathPoints
          });
          routeCalculated = true;
        }
      } catch (osrmErr) {
        console.warn("OSRM Routing failed, falling back to Haversine routing estimation:", osrmErr);
      }

      // Fallback: Haversine distance and path if OSRM is blocked/fails
      if (!routeCalculated) {
        const latDiff = endCoords[0] - startCoords[0];
        const lngDiff = endCoords[1] - startCoords[1];
        
        // Generate a smooth simulated path line between coordinates
        const pathPoints: [number, number][] = [
          startCoords,
          [startCoords[0] + latDiff * 0.25 + 0.08, startCoords[1] + lngDiff * 0.25 - 0.05],
          [startCoords[0] + latDiff * 0.5 - 0.05, startCoords[1] + lngDiff * 0.5 + 0.08],
          [startCoords[0] + latDiff * 0.75 + 0.03, startCoords[1] + lngDiff * 0.75 - 0.02],
          endCoords
        ];

        // Haversine formula
        const R = 6371; // km
        const dLat = (latDiff * Math.PI) / 180;
        const dLng = (lngDiff * Math.PI) / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(startCoords[0] * Math.PI / 180) * Math.cos(endCoords[0] * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceKm = R * c;

        const distanceStr = distanceKm.toFixed(1) + ' km';
        const durationMin = Math.round((distanceKm / 55) * 60); // 55 km/h average speed
        const durationStr = durationMin > 60 
          ? `${Math.floor(durationMin / 60)} hr ${durationMin % 60} mins` 
          : `${durationMin} mins`;
        const fuelLiters = distanceKm / 15;
        const costStr = `₹${Math.round(fuelLiters * 102)}`;

        setRoute({
          distance: distanceStr,
          duration: durationStr,
          cost: costStr,
          path: pathPoints
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while calculating the route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run on mount once to pre-fill the Delhi -> Agra route nicely
  useEffect(() => {
    calculateRoute();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Transport Route Planner</h1>
          <p className="text-gray-500 font-medium">Plan and optimize delivery routes with real geocoding and live distance mapping.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600 animate-pulse"/> Plan Route
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Start Location (Farm / City)</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={start} 
                    onChange={e => setStart(e.target.value)} 
                    placeholder="e.g. Delhi, Nashik, Pune..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none text-gray-800 font-medium transition-all" 
                  />
                </div>
              </div>
              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Navigation className="w-4 h-4 text-gray-500 rotate-45" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Destination (Market / Warehouse)</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-blue-600 w-5 h-5" />
                  <input 
                    type="text" 
                    value={end} 
                    onChange={e => setEnd(e.target.value)} 
                    placeholder="e.g. Agra, Mumbai, Bangalore..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none text-gray-800 font-medium transition-all" 
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                onClick={calculateRoute} 
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating Best Route...
                  </>
                ) : (
                  'Optimize Route'
                )}
              </button>
            </div>
          </motion.div>

          {route && !loading && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-3xl border border-blue-100 bg-blue-50/10 shadow-sm">
              <h3 className="font-bold text-blue-950 mb-4 text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" /> Route Diagnostics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-wider">Total Distance</p>
                    <p className="font-black text-gray-900 text-xl">{route.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-wider">Est. Duration</p>
                    <p className="font-black text-gray-900 text-xl">{route.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-blue-50 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-wider">Est. Fuel Cost</p>
                    <p className="font-black text-emerald-700 text-xl">{route.cost}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2 h-[600px] bg-white rounded-3xl border border-gray-100 overflow-hidden relative shadow-sm">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-gray-600 font-bold">Querying routing network...</p>
            </div>
          )}
          <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            {route && route.path && route.path.length > 0 && (
              <>
                <Marker position={route.path[0]}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-gray-900 text-xs uppercase tracking-wider text-blue-600">Start Location</p>
                      <p className="font-semibold text-gray-700 capitalize">{start}</p>
                    </div>
                  </Popup>
                </Marker>
                <Marker position={route.path[route.path.length - 1]}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-gray-900 text-xs uppercase tracking-wider text-emerald-600">Destination</p>
                      <p className="font-semibold text-gray-700 capitalize">{end}</p>
                    </div>
                  </Popup>
                </Marker>
                <Polyline positions={route.path} color="#2563eb" weight={6} opacity={0.85} lineJoin="round" lineCap="round" />
                <RouteMapUpdater path={route.path} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
