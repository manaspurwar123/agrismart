const fs = require('fs');

async function run() {
  let db;
  try {
    db = JSON.parse(fs.readFileSync('server-db.json', 'utf8'));
  } catch (err) {
    db = { applications: [] };
  }

  if (!db.applications) db.applications = [];
  
  const userId = "user-1";
  const existingApp = db.applications.find(a => a.userId === userId);
  
  if (!existingApp) {
    db.applications.push({
      id: "app-1",
      userId: userId,
      schemeId: "pm-kisan",
      schemeName: "PM-KISAN",
      status: "Submitted",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    db.applications.push({
      id: "app-2",
      userId: userId,
      schemeId: "kcc",
      schemeName: "Kisan Credit Card (KCC)",
      status: "Approved",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    });
    fs.writeFileSync('server-db.json', JSON.stringify(db, null, 2));
    console.log("Applications seeded");
  } else {
    console.log("Applications already seeded");
  }
}

run();
