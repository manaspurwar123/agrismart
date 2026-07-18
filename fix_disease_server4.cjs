const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startStr = '  // Cleanup file\n      fs.unlinkSync(req.file.path);\n      res.json(JSON.parse(response.text || "{}"));\n    } catch (error) {\n      res.status(500).json({ error: "Failed to detect disease" });\n    }\n  });';
const endStr = '  // Marketplace';

const startIdx = content.indexOf('app.post("/api/ai/disease-detection", upload.single("image"), async (req, res) => {\n    if (!req.file) return res.status(400).json({ error: "No image uploaded" });\n        \n    try {\n      const imageData = fs.readFileSync(req.file.path).toString("base64");\n      const promptText = "Identify the disease in this crop image');
const endIdx = content.indexOf('  // Marketplace');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
    fs.writeFileSync('server.ts', content);
}
