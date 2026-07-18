const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const seedFunc = `
  if (!db.bookings || db.bookings.length === 0) {
    db.bookings = [
      {
        id: "b-1",
        machineryId: "m-1",
        machineryName: "Mahindra Arjun Novo 605",
        machineryImage: "https://images.unsplash.com/photo-1594913785162-e6785b493bd2?q=80&w=1000",
        farmerId: "f-test",
        ownerId: "owner-1",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        totalPrice: 7500,
        status: "Approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "b-2",
        machineryId: "v-1",
        machineryName: "Tata Ace Gold",
        machineryImage: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000",
        farmerId: "f-test",
        ownerId: "owner-3",
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 4).toISOString(),
        totalPrice: 1200,
        status: "Completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeDb(db);
  }
`;

content = content.replace('if (!db.machinery || db.machinery.length === 0) {', seedFunc + '\n  if (!db.machinery || db.machinery.length === 0) {');

fs.writeFileSync('server.ts', content);
