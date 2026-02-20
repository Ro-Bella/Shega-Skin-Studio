const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://robi:robi123@cluster0.xxxxx.mongodb.net/shega-skin?retryWrites=true&w=majority
JWT_SECRET=super_secret_key_shega_skin_123!
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