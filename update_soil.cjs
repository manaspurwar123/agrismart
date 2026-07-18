const fs = require('fs');

let content = fs.readFileSync('src/pages/SoilAnalysisPage.tsx', 'utf8');

// Add Image icon
content = content.replace('Leaf\n} from \'lucide-react\';', 'Leaf,\n  Image as ImageIcon,\n  UploadCloud\n} from \'lucide-react\';');

// Add states
content = content.replace('const [showForm, setShowForm] = useState(false);', 
  `const [showForm, setShowForm] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'manual' | 'image'>('manual');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);`);

// Add handleImageUpload and handleImageAnalyze
content = content.replace('const handleAnalyze = async (e: React.FormEvent) => {',
`const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/soil/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      const data = await res.json();
      setResult(data);
      setShowForm(false);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {`);

// Modify form render part
const oldFormHeader = `<div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black">Soil Test Parameters</h2>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      <RefreshCcw className="w-5 h-5" />
                    </Button>
                  </div>`;
const newFormHeader = `<div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black">Analyze Soil</h2>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      <RefreshCcw className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => setAnalysisMode('manual')}
                      className={\`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest \${analysisMode === 'manual' ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-400'}\`}
                    >
                      Manual Entry
                    </button>
                    <button 
                      onClick={() => setAnalysisMode('image')}
                      className={\`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest \${analysisMode === 'image' ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-400'}\`}
                    >
                      <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Image AI</span>
                    </button>
                  </div>`;
content = content.replace(oldFormHeader, newFormHeader);

const oldFormStart = `<form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-8">`;
const newFormStart = `{analysisMode === 'manual' ? (
                  <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-8">`;
content = content.replace(oldFormStart, newFormStart);

const oldFormEnd = `</ResponsiveContainer>
                      </div>
                      <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-6 rounded-2xl text-lg font-black">
                        Analyze Parameters
                      </Button>
                    </div>
                  </form>`;
const newFormEnd = `</ResponsiveContainer>
                      </div>
                      <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-6 rounded-2xl text-lg font-black">
                        Analyze Parameters
                      </Button>
                    </div>
                  </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imagePreview ? (
                          <img src={imagePreview} alt="Soil preview" className="max-h-64 mx-auto rounded-2xl shadow-lg" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-[#2E7D32]">
                              <UploadCloud className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Upload Soil Photo</h3>
                            <p className="text-gray-500 text-sm">Take a clear picture of the soil in natural lighting</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        disabled={!imageBase64 || isAnalyzing}
                        onClick={handleImageAnalyze}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-6 rounded-2xl text-lg font-black disabled:opacity-50"
                      >
                        {isAnalyzing ? 'Analyzing AI Models...' : 'Predict Soil Quality'}
                      </Button>
                    </div>
                  )}`;
content = content.replace(oldFormEnd, newFormEnd);

fs.writeFileSync('src/pages/SoilAnalysisPage.tsx', content);
