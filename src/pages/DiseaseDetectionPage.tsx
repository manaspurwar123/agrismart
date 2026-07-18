import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Camera, 
  FileText, 
  History, 
  ShieldCheck, 
  Stethoscope, 
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Sprout,
  Trash2,
  Download,
  Share2,
  RefreshCcw,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DiseaseReport } from '../types';

export const DiseaseDetectionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiseaseReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/ai/disease-detection', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("AI analysis failed. Please try again with a clearer image.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const saveReport = async () => {
    if (!result) return;
    try {
      await fetch('/api/disease/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      alert("Report saved to history!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#2E7D32] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Next-Gen AI Crop Diagnostics
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Detect Plant Diseases <br />
            <span className="text-[#81C784]">In Seconds</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Upload a photo of your crop and let our advanced neural networks identify pests, diseases, and nutritional deficiencies instantly.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8"
            >
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E7D32] hover:bg-green-50/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Upload Crop Image</h3>
                  <p className="text-gray-500 mb-6">Drag and drop or click to browse (Max 10MB)</p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                      <Camera className="w-4 h-4" /> Take Photo
                    </Button>
                    <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2">
                      <FileText className="w-4 h-4" /> Browse Files
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                    <img 
                      src={preview} 
                      alt="Crop preview" 
                      className="w-full h-full object-contain"
                    />
                    {isScanning && (
                      <motion.div 
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] z-20"
                      />
                    )}
                    <button 
                      onClick={handleReset}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#2E7D32]" />
                      </div>
                      <div>
                        <p className="font-bold text-sm truncate max-w-[200px]">{file?.name}</p>
                        <p className="text-xs text-gray-500">{(file?.size! / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={handleReset}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                      <Button 
                        className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                        onClick={handleScan}
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <>
                            <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <Stethoscope className="w-4 h-4 mr-2" /> Scan Disease
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  {/* Result Card */}
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className={`p-1 text-center text-white text-xs font-bold tracking-widest uppercase ${
                      result.status === 'Healthy' ? 'bg-green-500' : 
                      result.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'
                    }`}>
                      {result.status} Status Detected
                    </div>
                    
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                          <div className="rounded-2xl overflow-hidden aspect-square shadow-lg border border-gray-100">
                            <img src={result.imageUrl} alt="Analyzed Crop" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 space-y-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[#2E7D32] font-bold text-sm uppercase tracking-wider">{result.cropName}</span>
                              <div className="h-1 w-1 bg-gray-300 rounded-full" />
                              <span className="text-gray-500 text-sm">{new Date(result.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2">
                              {result.status === 'Healthy' ? 'Healthy Plant' : result.diseaseName}
                            </h2>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                                <Info className="w-3.5 h-3.5" />
                                {result.confidenceScore}% Confidence
                              </div>
                              {result.status === 'Unhealthy' && (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${
                                  result.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                  'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  {result.severity} Severity
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 leading-relaxed italic">
                            "{result.analysis}"
                          </p>

                          <div className="flex gap-4">
                            <Button onClick={saveReport} className="bg-[#2E7D32] hover:bg-[#1B5E20] flex-1">
                              Save to History
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <Download className="w-4 h-4" /> PDF Report
                            </Button>
                            <Button variant="outline" size="icon">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Info Tabs Placeholder */}
                    <div className="border-t border-gray-100 bg-gray-50 p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" /> Symptoms & Causes
                          </h3>
                          <ul className="space-y-2">
                            {result.symptoms.map((s, i) => (
                              <li key={i} className="flex gap-2 text-sm text-gray-600">
                                <span className="text-[#2E7D32] mt-1">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-[#2E7D32]" /> Recommended Treatment
                          </h3>
                          <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm">
                            <p className="font-bold text-[#2E7D32] mb-1">Organic Approach:</p>
                            <p className="text-gray-600 mb-4">{result.treatment.organic}</p>
                            <p className="font-bold text-[#2E7D32] mb-1">Chemical Solution:</p>
                            <p className="text-gray-600">{result.treatment.chemical}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="font-bold text-xl mb-6 text-gray-900 block relative z-10">Prevention Guide</h3>
              <div className="space-y-4">
                {[
                  { icon: Droplets, title: "Water Management", desc: "Avoid over-irrigation to prevent fungal growth." },
                  { icon: Sprout, title: "Soil Health", desc: "Regular NPK balance check for immunity." },
                  { icon: ShieldCheck, title: "Crop Rotation", desc: "Change crops every season to break pest cycles." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-[#2E7D32] hover:bg-green-50">
                View Full Guide <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="bg-[#1B5E20] rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
                <Sprout className="w-40 h-40" />
              </div>
              <h3 className="font-bold text-2xl mb-4 relative z-10">Need Expert Advice?</h3>
              <p className="text-white/80 mb-6 relative z-10">Connect with our network of agricultural scientists for personalized guidance.</p>
              <Button className="w-full bg-white text-[#1B5E20] hover:bg-gray-100 font-bold py-6">
                Talk to Expert
              </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Detection History</h3>
                <History className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {/* Simplified history preview */}
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">No recent history</p>
                  <Button variant="link" className="text-[#2E7D32]">View All</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
