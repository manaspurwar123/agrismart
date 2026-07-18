const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The save route
const saveRoute = `
  app.post("/api/disease/save", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const report = {
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      ...req.body,
      date: new Date().toISOString()
    };
    
    updateCollection("diseaseReports", report);
    res.json({ success: true, id: report.id });
  });

  app.get("/api/disease/history", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    const history = db.diseaseReports?.filter((r: any) => r.userId === sessionUser.id) || [];
    res.json(history);
  });
`;

// Inject before app.get("/api/disease/statistics"
content = content.replace('app.get("/api/disease/statistics",', saveRoute + '\n  app.get("/api/disease/statistics",');

fs.writeFileSync('server.ts', content);
