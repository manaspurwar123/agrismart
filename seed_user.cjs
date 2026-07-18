const fs = require('fs');
const bcrypt = require('bcryptjs');

async function run() {
  let db;
  try {
    db = JSON.parse(fs.readFileSync('server-db.json', 'utf8'));
  } catch (err) {
    db = { users: [] };
  }

  const email = "purwarmanas2@gmail.com";
  const password = "manas@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!db.users) db.users = [];
  
  const existingUserIndex = db.users.findIndex(u => u.email === email);
  const user = {
    id: "user-1",
    name: "manas",
    email: email,
    mobile: "1234567890",
    password: hashedPassword,
    role: "Farmer",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingUserIndex >= 0) {
    db.users[existingUserIndex] = user;
  } else {
    db.users.push(user);
  }

  fs.writeFileSync('server-db.json', JSON.stringify(db, null, 2));
  console.log("User seeded");
}

run();
