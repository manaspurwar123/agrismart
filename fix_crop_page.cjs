const fs = require('fs');
let content = fs.readFileSync('src/pages/CropRecommendationPage.tsx', 'utf8');

// Add Image icons
content = content.replace('Download\n} from \'lucide-react\';', 'Download,\n  Image as ImageIcon,\n  UploadCloud\n} from \'lucide-react\';');

// Add states
const stateInjection = `const [analysisMode, setAnalysisMode] = useState<'manual' | 'image'>('manual');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);`;

content = content.replace('const [error, setError] = useState<string | null>(null);', `const [error, setError] = useState<string | null>(null);\n  ${stateInjection}`);

// Add handlers
const handlers = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };`;

content = content.replace('const handleNext = () =>', `${handlers}\n\n  const handleNext = () =>`);

// Update Render
const searchRender = `{/* Step-by-Step Wizard */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">`;

const replacementRender = `{/* Mode Switcher */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setAnalysisMode('manual'); setRecommendation(null); }}
            className={\`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all \${analysisMode === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}\`}
          >
            Manual Entry Wizard
          </button>
          <button 
            onClick={() => { setAnalysisMode('image'); setRecommendation(null); }}
            className={\`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all \${analysisMode === 'image' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}\`}
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
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">`;

content = content.replace(searchRender, replacementRender);

// Add the closing condition for the manual form wrap
// Actually it's better to just replace the recommendation check

const searchEnd = `{recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}`;

const replacementEnd = `) : null}
        
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}`;

content = content.replace(searchEnd, replacementEnd);

fs.writeFileSync('src/pages/CropRecommendationPage.tsx', content);
