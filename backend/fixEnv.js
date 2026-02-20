const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

const envContent = `NODE_ENV=development
PORT=5000
# ⚠️ እባክዎ ይህንን መስመር ከ MongoDB Atlas ባገኙት ትክክለኛ የ Connection String ይተኩት።
MONGO_URI=mongodb+srv://robitesf_db:Robi7640@shega-app.vmzp4ck.mongodb.net/?appName=Shega-App
JWT_SECRET=shegaskinstudio@123
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=password123
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env ፋይል በተሳካ ሁኔታ ተፈጥሯል!');
  console.log(`ቦታው: ${envPath}`);
  console.log('አሁን ሰርቨሩን እንደገና ማስጀመር ይችላሉ (Restart Server)።');
} catch (err) {
  console.error('❌ ፋይሉን መፍጠር አልተቻለም:', err);
}