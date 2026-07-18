import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, Sprout, MapPin, Droplets, Thermometer, Wind, 
  ChevronRight, ChevronLeft, Loader2, Save, History, 
  BarChart3, Info, CheckCircle2, TrendingUp, AlertTriangle, 
  Scale, Clock, Wallet, BookOpen, Download,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { CropRecommendation } from '../types';
import { cn } from '../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const steps = [
  { id: 1, title: 'Farm info', icon: MapPin },
  { id: 2, title: 'Soil Data', icon: Sprout },
  { id: 3, title: 'Weather', icon: Thermometer },
  { id: 4, title: 'Preferences', icon: Wallet }
];

export default function CropRecommendationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recommendation, setRecommendation] = useState<CropRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'manual' | 'image'>('manual');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const [formData, setFormData] = useState({
    farmerName: '',
    farmName: '',
    state: '',
    district: '',
    village: '',
    farmArea: 0,
    soilType: 'Loamy',
    soilPh: 6.5,
    nitrogen: 40,
    phosphorus: 40,
    potassium: 40,
    organicCarbon: 0.5,
    season: 'Kharif',
    avgTemperature: 25,
    rainfall: 1000,
    humidity: 60,
    irrigationAvailable: true,
    preferredCropType: 'Cereal',
    budget: 10000,
    waterAvailability: 'Good',
    organicFarming: false,
    previousCrop: '',
    farmingExperience: 'Intermediate'
  });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalyze = async () => {
    if (!imageBase64) return;
    setIsAnalyzingImage(true);
    setError(null);
    try {
      const response = await axios.post('/api/crop-recommendation/analyze-image', { imageBase64 });
      setRecommendation(response.data);
    } catch (err) {
      setError('Failed to generate recommendation from image. Please try again.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const generateRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/crop-recommendation/generate', formData);
      setRecommendation(response.data);
    } catch (err) {
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendation = async () => {
    if (!recommendation) return;
    setIsSaving(true);
    try {
      await axios.post('/api/crop-recommendation/save', recommendation);
      alert('Recommendation saved successfully!');
    } catch (err) {
      alert('Failed to save recommendation.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Farmer Name</label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={e => setFormData({ ...formData, farmerName: e.target.value })}
                  placeholder="Enter farmer name"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Farm Name</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="Enter farm name"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Nashik"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Enter village"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Farm Area (Acres)</label>
                <input
                  type="number"
                  value={formData.farmArea}
                  onChange={e => setFormData({ ...formData, farmArea: parseFloat(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                >
                  <option>Clay</option>
                  <option>Sandy</option>
                  <option>Loamy</option>
                  <option>Black</option>
                  <option>Red</option>
                  <option>Alluvial</option>
                  <option>Laterite</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={e => setFormData({ ...formData, soilPh: parseFloat(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nitrogen (N)</label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={e => setFormData({ ...formData, nitrogen: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phosphorus (P)</label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={e => setFormData({ ...formData, phosphorus: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Potassium (K)</label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={e => setFormData({ ...formData, potassium: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.organicCarbon}
                  onChange={e => setFormData({ ...formData, organicCarbon: parseFloat(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Season</label>
                <select
                  value={formData.season}
                  onChange={e => setFormData({ ...formData, season: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                >
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Zaid</option>
                  <option>All Year</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Avg Temperature (°C)</label>
                <input
                  type="number"
                  value={formData.avgTemperature}
                  onChange={e => setFormData({ ...formData, avgTemperature: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Annual Rainfall (mm)</label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={e => setFormData({ ...formData, rainfall: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Humidity (%)</label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={e => setFormData({ ...formData, humidity: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-gray-100 col-span-full">
                <input
                  type="checkbox"
                  checked={formData.irrigationAvailable}
                  onChange={e => setFormData({ ...formData, irrigationAvailable: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Irrigation Available?</span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preferred Crop Type</label>
                <select
                  value={formData.preferredCropType}
                  onChange={e => setFormData({ ...formData, preferredCropType: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                >
                  <option>Cereal</option>
                  <option>Pulse</option>
                  <option>Vegetable</option>
                  <option>Fruit</option>
                  <option>Oilseed</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Budget (INR)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Water Availability</label>
                <select
                  value={formData.waterAvailability}
                  onChange={e => setFormData({ ...formData, waterAvailability: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Moderate</option>
                  <option>Poor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Farming Experience</label>
                <select
                  value={formData.farmingExperience}
                  onChange={e => setFormData({ ...formData, farmingExperience: e.target.value })}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Previous Crop</label>
                <input
                  type="text"
                  value={formData.previousCrop}
                  onChange={e => setFormData({ ...formData, previousCrop: e.target.value })}
                  placeholder="e.g. Wheat"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-gray-100 col-span-full">
                <input
                  type="checkbox"
                  checked={formData.organicFarming}
                  onChange={e => setFormData({ ...formData, organicFarming: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Focus on Organic Farming?</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (recommendation) {
    const profitData = {
      labels: [recommendation.recommendedCrop, ...recommendation.alternatives.map(a => a.name)],
      datasets: [{
        label: 'Estimated Profit (INR/Acre)',
        data: [recommendation.estimatedProfit, ...recommendation.alternatives.map(a => a.profit)],
        backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(52, 211, 153, 0.4)', 'rgba(110, 231, 183, 0.4)', 'rgba(209, 250, 229, 0.4)'],
        borderColor: ['#10b981', '#34d399', '#6ee7b7', '#d1fae5'],
        borderWidth: 2,
        borderRadius: 12
      }]
    };

    const radarData = {
      labels: ['Yield', 'Profit', 'Sustainability', 'Market Demand', 'Ease of Growth'],
      datasets: [{
        label: recommendation.recommendedCrop,
        data: [
          recommendation.confidenceScore, 
          (recommendation.estimatedProfit / 100000) * 100, 
          recommendation.sustainabilityScore,
          recommendation.marketDemand === 'High' ? 100 : recommendation.marketDemand === 'Moderate' ? 60 : 30,
          recommendation.difficultyLevel === 'Easy' ? 100 : recommendation.difficultyLevel === 'Moderate' ? 60 : 30
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981'
      }]
    };

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Recommendation Result</h1>
            <p className="text-gray-600">Generated for {recommendation.farmName} in {recommendation.district}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveRecommendation}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Recommendation
            </button>
            <button
              onClick={() => setRecommendation(null)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all"
            >
              Start New
            </button>
          </div>
        </div>

        {/* Primary Result Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-gray-50 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                    Best Match: {recommendation.confidenceScore}% Confidence
                  </span>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tight">{recommendation.recommendedCrop}</h2>
                </div>
                <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 rotate-6">
                  <Sprout size={48} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Expected Yield</p>
                  <p className="text-lg font-bold text-gray-900">{recommendation.expectedYield}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Est. Profit</p>
                  <p className="text-lg font-bold text-emerald-600">₹{(recommendation.estimatedProfit || 0).toLocaleString()}/Acre</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Duration</p>
                  <p className="text-lg font-bold text-gray-900">{recommendation.cropDuration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Difficulty</p>
                  <p className={cn(
                    "text-lg font-bold",
                    recommendation.difficultyLevel === 'Easy' ? 'text-green-600' : 
                    recommendation.difficultyLevel === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                  )}>{recommendation.difficultyLevel}</p>
                </div>
              </div>

              <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl h-fit">
                    <Info size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-emerald-900">Why this recommendation?</h4>
                    <p className="text-emerald-800/80 leading-relaxed">{recommendation.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 h-full">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Performance Analysis
              </h3>
              <div className="h-64">
                <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } } }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Water Need</p>
              <p className="font-bold text-gray-900">{recommendation.waterRequirement}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Market Demand</p>
              <p className="font-bold text-gray-900">{recommendation.marketDemand}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sustainability</p>
              <p className="font-bold text-gray-900">{recommendation.sustainabilityScore}% Score</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pest Risk</p>
              <p className="font-bold text-gray-900">{recommendation.pestRiskLevel}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50">
            <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Wallet size={20} className="text-emerald-500" />
              Profitability Comparison
            </h3>
            <div className="h-80">
              <Bar data={profitData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50">
            <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" />
              Key Recommendations
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Optimal Fertilizer</h4>
                  <p className="text-gray-600 text-sm">{recommendation.fertilizerSuggestion}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Harvest Timeline</h4>
                  <p className="text-gray-600 text-sm">Expected around {recommendation.estimatedHarvestDate}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/recommendation/${recommendation.id}`)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
              >
                <BookOpen size={20} />
                View Detailed Farming Guide
              </button>
            </div>
          </div>
        </div>

        {/* Alternatives Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Alternative Crop Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendation.alternatives.map((alt, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-50 group hover:border-emerald-200 transition-all">
                <div className="w-full h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                  <img src={alt.imageUrl} alt={alt.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur text-emerald-600 text-xs font-bold rounded-full">
                    {Math.round((alt.profit / recommendation.estimatedProfit) * 100)}% Profit
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{alt.name}</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Est. Profit</p>
                    <p className="font-bold text-gray-900 text-sm">₹{(alt.profit || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Yield</p>
                    <p className="font-bold text-gray-900 text-sm">{alt.yield}</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pt-20">
      {/* Agriculture Background Banner */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-emerald-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Agriculture" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 mx-auto shadow-2xl"
          >
            <Leaf size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white">AI Crop Recommendation</h1>
          <p className="text-emerald-100 font-medium max-w-xl mx-auto">
            Get personalized crop suggestions powered by advanced agricultural AI models.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setAnalysisMode('manual'); setRecommendation(null); }}
            className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${analysisMode === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Manual Entry Wizard
          </button>
          <button 
            onClick={() => { setAnalysisMode('image'); setRecommendation(null); }}
            className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all ${analysisMode === 'image' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <ImageIcon size={18} /> Field Image AI
          </button>
        </div>

        {analysisMode === 'image' && !recommendation ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-black text-center mb-8">AI Field Analysis</h2>
            <div className="max-w-xl mx-auto space-y-8">
              <div className="border-2 border-dashed border-emerald-200 rounded-3xl p-10 text-center hover:bg-emerald-50 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Field preview" className="max-h-64 mx-auto rounded-2xl shadow-lg" />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upload Field Photo</h3>
                    <p className="text-gray-500 text-sm">Take a clear picture of your land or soil</p>
                  </div>
                )}
              </div>
              <button 
                disabled={!imageBase64 || isAnalyzingImage}
                onClick={handleImageAnalyze}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-2xl text-white text-lg font-black disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {isAnalyzingImage ? (
                  <><Loader2 size={24} className="animate-spin" /> Analyzing Field...</>
                ) : (
                  <><Sprout size={24} /> Get Recommendation</>
                )}
              </button>
            </div>
          </div>
        ) : analysisMode === 'manual' && !recommendation ? (
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Leaf size={200} className="rotate-45" />
          </div>

          <div className="relative z-10">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mb-12">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-3">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isActive ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-110" : 
                        isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400"
                      )}>
                        {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                      </div>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        isActive ? "text-emerald-600" : "text-gray-400"
                      )}>{step.title}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="flex-1 h-[2px] mx-4 bg-gray-100 relative">
                        <div className={cn(
                          "absolute inset-0 bg-emerald-500 transition-all duration-500",
                          isCompleted ? "w-full" : "w-0"
                        )}></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-4"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all disabled:opacity-0"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all group active:scale-95"
                >
                  Continue
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={generateRecommendation}
                  disabled={isLoading}
                  className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 shadow-xl transition-all group active:scale-95 disabled:bg-gray-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Analyzing Farm Data...
                    </>
                  ) : (
                    <>
                      Generate AI Recommendation
                      <Sprout size={24} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        ) : null}

        <div className="flex justify-center gap-8 py-8">
          <button 
            onClick={() => navigate('/recommendation-history')}
            className="flex items-center gap-2 text-emerald-700 font-bold hover:underline"
          >
            <History size={20} />
            View My Recommendation History
          </button>
          <button 
            onClick={() => navigate('/recommendation-comparison')}
            className="flex items-center gap-2 text-emerald-700 font-bold hover:underline"
          >
            <Scale size={20} />
            Compare Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
