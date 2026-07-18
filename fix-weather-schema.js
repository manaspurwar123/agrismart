const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = 'const prompt = `Generate realistic current weather data for coordinates ${lat}, ${lon}. Return JSON format.`;';
const newPrompt = `const prompt = \`Generate realistic current weather data for coordinates \${lat}, \${lon}. Return JSON matching this exact schema:
{
  "location": "City, Country",
  "condition": "Clear|Rain|Storm|Cloudy|Sunny",
  "temp": 28,
  "humidity": 65,
  "windSpeed": 12,
  "rainProbability": 20,
  "sunrise": "06:00 AM",
  "sunset": "06:30 PM",
  "forecast": {
    "hourly": [{"time": "10:00 AM", "temp": 28, "condition": "Sunny"}],
    "weekly": [{"day": "Mon", "temp": 28}, {"day": "Tue", "temp": 29}]
  },
  "alerts": [{"type": "Heavy Rain", "severity": "High", "message": "Expected heavy rainfall"}],
  "farmingAdvice": ["Delay pesticide spray due to high wind", "Good time for irrigation"]
}\`;`;

if (code.includes(oldPrompt)) {
  code = code.replace(oldPrompt, newPrompt);
  fs.writeFileSync('server.ts', code);
  console.log('Fixed weather prompt');
} else {
  console.log('Old prompt not found');
}
