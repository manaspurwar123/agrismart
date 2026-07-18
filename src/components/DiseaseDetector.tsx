import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle2, Sparkles, ShieldAlert, Microscope } from 'lucide-react';

interface DiseaseResult {
  disease: string;
  confidence: number;
  symptoms: string[];
  causes: string;
  prevention: string;
  treatment: string;
}

export default function DiseaseDetector() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);

    try {
      const res = await fetch('/api/ai/disease-detection', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-3xl mb-6">
          <Camera className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Crop Disease Detection</h1>
        <p className="text-gray-500">Upload a photo of your crop to identify diseases instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-[40px] border-4 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-200 transition-colors overflow-hidden group relative"
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Upload" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-bold">Change Image</p>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold text-lg">Click to Upload or Drag & Drop</p>
                <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG up to 10MB</p>
              </div>
            )}
            <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
          </div>
          
          <button 
            onClick={handleSubmit} disabled={!image || loading}
            className="w-full py-5 bg-orange-600 text-white rounded-3xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {loading ? <Sparkles className="w-6 h-6 animate-spin" /> : <Microscope className="w-6 h-6" />}
            {loading ? 'Analyzing Plant Tissue...' : 'Detect Disease'}
          </button>
        </div>

        <div>
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">Analysis Result</span>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> {(result.confidence * 100).toFixed(1)}% Match
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6">{result.disease}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-orange-500" /> Symptoms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.symptoms.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <ShieldAlert className="w-4 h-4 text-orange-500" /> Causes
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.causes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1B5E20] text-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#81C784]" /> Treatment & Prevention
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[#81C784] text-xs font-bold uppercase mb-2">Immediate Treatment</p>
                    <p className="text-sm opacity-90 leading-relaxed">{result.treatment}</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-[#81C784] text-xs font-bold uppercase mb-2">Long-term Prevention</p>
                    <p className="text-sm opacity-90 leading-relaxed">{result.prevention}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[40px] p-12 flex flex-col items-center justify-center text-center border-4 border-white h-full min-h-[400px]">
              <Microscope className="w-20 h-20 text-gray-200 mb-6" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Tissue Analysis Pending</h3>
              <p className="text-gray-400 max-w-xs">Upload an image to start the biological diagnostic process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
