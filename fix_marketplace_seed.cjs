const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const seedFunc = `
  const seedProducts = () => {
    const db = readDb();
    if (!db.products || db.products.length === 0) {
      db.products = [
        { id: "p1", name: "Organic Tomatoes", category: "Vegetables", price: 40, unit: "kg", isOrganic: true, farmerId: "f1", farmerName: "Ramesh Kumar", location: { district: "Nashik" }, description: "Freshly picked organic tomatoes.", images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800"], rating: 4.8, reviewsCount: 120 },
        { id: "p2", name: "Basmati Rice", category: "Grains", price: 120, unit: "kg", isOrganic: false, farmerId: "f2", farmerName: "Suresh Patil", location: { district: "Karnal" }, description: "Premium long-grain basmati rice.", images: ["https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=800"], rating: 4.9, reviewsCount: 340 },
        { id: "p3", name: "Alphonso Mangoes", category: "Fruits", price: 800, unit: "dozen", isOrganic: true, farmerId: "f3", farmerName: "Kisan Rao", location: { district: "Ratnagiri" }, description: "Sweet and juicy Alphonso mangoes.", images: ["https://images.unsplash.com/photo-1553279768-865429bf2400?w=800"], rating: 5.0, reviewsCount: 890 },
        { id: "p4", name: "Tractor Rental", category: "Equipment", price: 1500, unit: "day", isOrganic: false, farmerId: "f1", farmerName: "Ramesh Kumar", location: { district: "Nashik" }, description: "Mahindra 575 DI available for rent.", images: ["https://images.unsplash.com/photo-1592982537447-6f29402c98d6?w=800"], rating: 4.5, reviewsCount: 50 },
        { id: "p5", name: "Toor Dal (Pigeon Pea)", category: "Pulses", price: 110, unit: "kg", isOrganic: true, farmerId: "f2", farmerName: "Suresh Patil", location: { district: "Latur" }, description: "Unpolished organic Toor Dal.", images: ["https://images.unsplash.com/photo-1610444391672-04bd2fdf8cba?w=800"], rating: 4.7, reviewsCount: 210 },
        { id: "p6", name: "Sunflower Seeds", category: "Seeds", price: 300, unit: "kg", isOrganic: true, farmerId: "f4", farmerName: "Anil Deshmukh", location: { district: "Pune" }, description: "High yielding sunflower seeds.", images: ["https://images.unsplash.com/photo-1590494483756-12151decfc47?w=800"], rating: 4.6, reviewsCount: 85 }
      ];
      writeDb(db);
    }
  };
`;

content = content.replace('  const seedData = () => {', seedFunc + '\n  const seedData = () => {');
content = content.replace('  seedData();', '  seedProducts();\n  seedData();');

fs.writeFileSync('server.ts', content);
