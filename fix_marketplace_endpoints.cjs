const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startIdx = content.indexOf('app.get("/api/products", (req, res) => {\n    const db = readDb();\n    res.json(db.products);\n  });');
const endIdx = content.indexOf('// Seed Data for Government Module');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
    fs.writeFileSync('server.ts', content);
}
