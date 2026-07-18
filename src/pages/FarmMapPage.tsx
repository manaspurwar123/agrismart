import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { 
  Map as MapIcon, 
  MapPin, 
  Layers, 
  Navigation, 
  Search, 
  Warehouse, 
  ShoppingCart, 
  Droplets, 
  Home,
  AlertCircle,
  Maximize2,
  RefreshCcw,
  Plus,
  Box
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

const API_KEY = '' as string;
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Component to handle drawing the farm boundary
const FarmBoundary = ({ farm, visible }: { farm: any, visible: boolean }) => {
  const map = useMap();
  const maps = useMapsLibrary('maps');
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || !maps || !farm || !visible) {
      if (polygon) polygon.setMap(null);
      return;
    }

    // Create a square boundary around the center for simulation
    const offset = 0.002;
    const paths = [
      { lat: farm.latitude + offset, lng: farm.longitude - offset },
      { lat: farm.latitude + offset, lng: farm.longitude + offset },
      { lat: farm.latitude - offset, lng: farm.longitude + offset },
      { lat: farm.latitude - offset, lng: farm.longitude - offset }
    ];

    const newPolygon = new google.maps.Polygon({
      paths,
      strokeColor: '#2E7D32',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#2E7D32',
      fillOpacity: 0.35,
      map: map,
      editable: true,
      draggable: true
    });

    setPolygon(newPolygon);

    return () => {
      newPolygon.setMap(null);
    };
  }, [map, maps, farm, visible]);

  return null;
};

export const FarmMapPage: React.FC = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockFarms = [
        {
          id: '1',
          name: 'Green Valley Estate',
          latitude: 28.6139,
          longitude: 77.2090,
          village: 'Karnal',
          district: 'Karnal',
          state: 'Haryana',
          size: 15,
          crop: 'Wheat',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Sunrise Orchards',
          latitude: 19.0760,
          longitude: 72.8777,
          village: 'Nashik',
          district: 'Nashik',
          state: 'Maharashtra',
          size: 8,
          crop: 'Grapes',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Riverfront Fields',
          latitude: 30.9009,
          longitude: 75.8572,
          village: 'Ludhiana',
          district: 'Ludhiana',
          state: 'Punjab',
          size: 20,
          crop: 'Rice',
          status: 'Active'
        }
      ];
      setFarms(mockFarms);
      if (mockFarms.length > 0) {
        setMapCenter({ lat: mockFarms[0].latitude, lng: mockFarms[0].longitude });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="min-h-screen pt-40 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl bg-white rounded-[40px] p-12 shadow-2xl border border-red-50">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-8" />
          <h2 className="text-3xl font-black mb-4 text-gray-900">Google Maps API Key Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            To view your farm locations and nearby services, please add your Google Maps Platform API key in the project settings.
          </p>
          <div className="text-left space-y-4 mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <p className="text-sm font-bold text-gray-900">1. Go to Google Cloud Console to get a key.</p>
            <p className="text-sm font-bold text-gray-900">2. Open AI Studio Settings (⚙️ icon).</p>
            <p className="text-sm font-bold text-gray-900">3. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> to Secrets.</p>
          </div>
          <Button className="w-full bg-[#2E7D32]" onClick={() => window.location.reload()}>
            I've Added the Key
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen pt-20 flex overflow-hidden bg-gray-50">
      {/* Sidebar Controls */}
      <div className="w-96 bg-white border-r border-gray-100 flex flex-col z-20 shadow-xl">
        <div className="p-8 border-b border-gray-50">
          <h1 className="text-3xl font-black tracking-tight mb-2">Farm Map</h1>
          <p className="text-gray-400 text-sm font-medium">Explore your fields and nearby agricultural infrastructure</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Your Farms</p>
            {farms.map((farm) => (
              <button
                key={farm.id}
                onClick={() => {
                  setSelectedFarm(farm);
                  setMapCenter({ lat: farm.latitude, lng: farm.longitude });
                  setZoom(16);
                }}
                className={`w-full text-left p-6 rounded-3xl border transition-all ${
                  selectedFarm?.id === farm.id 
                  ? 'bg-green-50 border-green-100 shadow-sm' 
                  : 'bg-white border-gray-50 hover:border-green-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-gray-900">{farm.name}</h3>
                  <div className="bg-green-100 p-2 rounded-xl">
                    <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{farm.village}, {farm.district}</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-gray-100 text-gray-400 uppercase">
                    {farm.crop}
                  </span>
                  <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-gray-100 text-gray-400 uppercase">
                    {farm.size} Acres
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Nearby Services</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Warehouse />, label: 'Markets' },
                { icon: <ShoppingCart />, label: 'Warehouses' },
                { icon: <Droplets />, label: 'Water' },
                { icon: <Home />, label: 'Offices' }
              ].map((service, i) => (
                <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#2E7D32] shadow-sm">
                    {service.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-600">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-2xl py-6 gap-2">
            <Maximize2 className="w-4 h-4" /> Expand Analysis
          </Button>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            center={mapCenter}
            zoom={zoom}
            mapId="AGRISMART_FARM_MAP"
            style={{ width: '100%', height: '100%' }}
            disableDefaultUI={true}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {farms.map((farm) => (
              <AdvancedMarker
                key={farm.id}
                position={{ lat: farm.latitude, lng: farm.longitude }}
                onClick={() => setSelectedFarm(farm)}
              >
                <div className="relative group cursor-pointer">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black text-gray-900 whitespace-nowrap">{farm.name}</p>
                  </div>
                  <Pin background={'#2E7D32'} glyphColor={'#FFF'} borderColor={'#1B5E20'} />
                </div>
              </AdvancedMarker>
            ))}

            {selectedFarm && <FarmBoundary farm={selectedFarm} visible={true} />}

            {selectedFarm && (
              <InfoWindow
                position={{ lat: selectedFarm.latitude, lng: selectedFarm.longitude }}
                onCloseClick={() => setSelectedFarm(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-black text-lg text-gray-900 mb-1">{selectedFarm.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{selectedFarm.village}, {selectedFarm.district}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Crop</p>
                      <p className="text-xs font-black text-[#2E7D32]">{selectedFarm.crop}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Size</p>
                      <p className="text-xs font-black text-[#2E7D32]">{selectedFarm.size} Ac</p>
                    </div>
                  </div>
                  <Button className="w-full py-2 text-xs h-auto rounded-xl">
                    Open Insights
                  </Button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Map Overlays */}
        <div className="absolute top-8 right-8 z-10 flex flex-col gap-3">
          <button className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center hover:bg-white transition-all group">
            <Layers className="w-6 h-6 text-gray-400 group-hover:text-[#2E7D32]" />
          </button>
          <button className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center hover:bg-white transition-all group" onClick={() => setZoom(z => z + 1)}>
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#2E7D32]" />
          </button>
          <button className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center hover:bg-white transition-all group" onClick={() => setZoom(z => z - 1)}>
            <div className="w-4 h-1 bg-gray-400 group-hover:bg-[#2E7D32] rounded-full" />
          </button>
        </div>

        <div className="absolute bottom-8 right-8 left-8 md:left-auto md:w-96 z-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 leading-none mb-1">Live Navigation</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Real-time coordinates active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                placeholder="Search location..."
                className="flex-1 bg-white/50 border border-gray-100 rounded-xl px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <Button className="w-10 h-10 p-0 rounded-xl">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
