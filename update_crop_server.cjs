const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/crop-recommendation/analyze-image", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    try {
      const prompt = \`As an AI Agronomist, analyze this image of a field or soil. Recommend the best crop to grow. Return JSON with this EXACT structure:
{
  "recommendedCrop": "Crop Name",
  "confidenceScore": 85,
  "expectedYield": "15 quintals/acre",
  "estimatedRevenue": "₹45,000",
  "growthDuration": "120 days",
  "whyThisCrop": "Brief explanation",
  "suitableVarieties": ["Var 1", "Var 2"],
  "soilPreparation": "Instructions",
  "fertilizerPlan": "N: 40, P: 20, K: 20",
  "irrigationNeeds": "Moderate",
  "marketDemand": "High",
  "riskFactors": ["Risk 1"]
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
  });
`;

content = content.replace('app.post("/api/crop-recommendation/generate", async (req, res) => {', newRoute + '\n  app.post("/api/crop-recommendation/generate", async (req, res) => {');

fs.writeFileSync('server.ts', content);
