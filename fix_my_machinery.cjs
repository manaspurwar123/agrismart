const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'if (ownerId) machinery = machinery.filter(m => m.ownerId === ownerId);',
  `if (ownerId) {
      if (ownerId === 'current_user' && (req.session as any).user) {
        machinery = machinery.filter(m => m.ownerId === (req.session as any).user.id);
      } else {
        machinery = machinery.filter(m => m.ownerId === ownerId);
      }
    }`
);
fs.writeFileSync('server.ts', content);
