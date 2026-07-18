const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldRouteStr = `  app.post("/api/crop-recommendation/analyze-image", async (req, res) => {`;
const targetEnd = `  app.post("/api/crop-recommendation/generate", async (req, res) => {`;

const startIdx = content.indexOf(oldRouteStr);
const endIdx = content.indexOf(targetEnd);

if (startIdx !== -1 && endIdx !== -1) {
  const newRoute = `  app.post("/api/crop-recommendation/analyze-image", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    try {
      const prompt = \`As an AI Agronomist, analyze this image of a field or soil. Recommend the best crop to grow based on visual assessment. Return JSON matching EXACTLY this structure:
{
  "recommendedCrop": "Crop Name",
  "confidenceScore": 85,
  "reason": "Brief explanation",
  "expectedYield": "15 quintals/acre",
  "estimatedProfit": 45000,
  "cropDuration": "120 days",
  "waterRequirement": "Moderate",
  "fertilizerSuggestion": "N: 40, P: 20, K: 20",
  "pestRiskLevel": "Low",
  "suitableSeason": "Kharif",
  "estimatedHarvestDate": "October 2026",
  "marketDemand": "High",
  "difficultyLevel": "Moderate",
  "sustainabilityScore": 80,
  "alternatives": [
    {
      "name": "Alternative Crop 1",
      "reason": "Good for dry conditions",
      "profit": 35000
    },
    {
      "name": "Alternative Crop 2",
      "reason": "Requires less fertilizer",
      "profit": 40000
    }
  ],
  "farmName": "My AI Farm",
  "district": "Unknown"
}\`;

      const base64Data = imageBase64.replace(/^data:image\\/\\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });
      
      const recommendationData = JSON.parse(response.text || "{}");
      
      const fullRecommendation = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...recommendationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      updateCollection("cropRecommendations", fullRecommendation);
      res.json(fullRecommendation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Crop image analysis failed" });
    }
  });\n\n`;

  content = content.substring(0, startIdx) + newRoute + content.substring(endIdx);
  fs.writeFileSync('server.ts', content);
}
