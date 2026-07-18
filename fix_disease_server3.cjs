const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace('app.use(express.json());', "app.use(express.json());\n  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));");

// Remove the fs.unlinkSync(req.file.path)
content = content.replace('fs.unlinkSync(req.file.path);', '// fs.unlinkSync(req.file.path); // Keep the file for frontend rendering');

fs.writeFileSync('server.ts', content);
