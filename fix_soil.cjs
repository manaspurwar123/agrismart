const fs = require('fs');

let content = fs.readFileSync('src/pages/SoilAnalysisPage.tsx', 'utf8');

const oldFormEnd = `                      <Button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-4"
                      >
                        {isAnalyzing ? <RefreshCcw className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                        Run AI Soil Analysis
                      </Button>
                    </div>
                  </form>`;
const newFormEnd = `                      <Button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] py-4"
                      >
                        {isAnalyzing ? <RefreshCcw className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                        Run AI Soil Analysis
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
