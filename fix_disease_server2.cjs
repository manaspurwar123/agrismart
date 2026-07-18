const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startStr = 'app.post("/api/ai/disease-detection", upload.single("image"), async (req, res) => {';
const endStr = 'app.get("/api/disease/statistics", (req, res) => {';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newRoute = `app.post("/api/ai/disease-detection", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    
    try {
      const imageData = fs.readFileSync(req.file.path).toString("base64");
      const promptText = \`Identify the disease in this crop image. Return JSON matching EXACTLY this structure:
{
  "cropName": "Crop Name",
  "diseaseName": "Disease Name",
  "confidenceScore": 95,
  "severity": "Low", // or Medium, High, Critical
  "status": "Unhealthy", // or Healthy
  "analysis": "Brief analysis",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": ["Cause 1", "Cause 2"],
  "treatment": {
    "organic": "Organic treatment",
    "chemical": "Chemical treatment",
    "homeRemedies": "Home remedies",
    "recommendedPesticides": ["Pesticide 1", "Pesticide 2"],
    "sprayInstructions": "How to spray",
    "safetyInstructions": "Safety instructions"
  }
}\`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: promptText },
          { inlineData: { mimeType: req.file.mimetype, data: imageData } }
        ],
        config: { responseMimeType: "application/json" }
      });
      
      // Cleanup file
      fs.unlinkSync(req.file.path);
      
      const analysisData = JSON.parse(response.text || "{}");
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: "/uploads/" + req.file.filename,
        createdAt: new Date().toISOString(),
        ...analysisData
      };
      
      res.json(result);
    } catch (error) { 
      console.error(error);
      res.status(500).json({ error: "Failed to detect disease" }); 
    }
  });

  `;
  content = content.substring(0, startIdx) + newRoute + content.substring(endIdx);
  fs.writeFileSync('server.ts', content);
}
