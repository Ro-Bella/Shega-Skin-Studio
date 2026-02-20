const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

const envContent = `NODE_ENV=development
PORT=5000
# ⚠️ እባክዎ ይህንን መስመር ከ MongoDB Atlas ባገኙት ትክክለኛ የ Connection String ይተኩት።
# "bad auth: authentication failed" የሚል ስህተት ካጋጠመዎ፣ ምክንያቱ ከታች ያለው MONGO_URI ውስጥ ያለው username (robitesf_db) ወይም password (Robi7640) የተሳሳተ መሆኑ ነው።
#
# ✅ መፍትሄው:
# 1. ወደ MongoDB Atlas አካውንትዎ ይግቡ።
# 2. በግራ በኩል ካለው ዝርዝር "Database Access" የሚለውን ይምረጡ።
# 3. ለ 'robitesf_db' የሚባል ተጠቃሚ (user) የይለፍ ቃሉን (password) ይቀይሩ ወይም አዲስ ተጠቃሚ ይፍጠሩ።
# 4. አዲሱን የይለፍ ቃል ከታች ባለው መስመር ላይ <password> ከሚለው ቦታ በትክክል ይተኩ።
MONGO_URI=mongodb+srv://robitesf_db:<password>@shega-app.vmzp4ck.mongodb.net/?appName=Shega-App
JWT_SECRET=shegaskinstudio@123
JWT_EXPIRE=30d
ADMIN_EMAIL=robi@example.com
ADMIN_PASSWORD=shega123
SUPER_ADMIN_EMAIL=baby@example.com
SUPER_ADMIN_PASSWORD=shega123
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env ፋይል በተሳካ ሁኔታ ተፈጥሯል!');
  console.log(`ቦታው: ${envPath}`);
  console.log('አሁን ሰርቨሩን እንደገና ማስጀመር ይችላሉ (Restart Server)።');
} catch (err) {
  console.error('❌ ፋይሉን መፍጠር አልተቻለም:', err);
}