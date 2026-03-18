const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

const envContent = `NODE_ENV=development
PORT=5000

# -------------------------------------------------------------------
# ⚠️ ዳታቤዝ ለማገናኘት (MongoDB Connection)
# -------------------------------------------------------------------
# እባክዎ ይህንን መስመር ከ MongoDB Atlas ባገኙት ትክክለኛ የ Connection String ይተኩት።
# <username>፣ <password>፣ እና <your-cluster-url> በሚሉት ቦታዎች የዳታቤዝ መረጃዎን ያስገቡ።
MONGO_URI=mongodb+srv://<username>:<password>@your-cluster-url.mongodb.net/shega-app?appName=Shega-App

# -------------------------------------------------------------------
# ⚠️ ለደህንነት (Security)
# -------------------------------------------------------------------
# ጠንካራ እና ለማንም ያልተገለጸ የ JWT Secret ቁልፍ እዚህ ያስገቡ።
# ለምሳሌ፦ any_random_strong_secret_key_12345
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

# -------------------------------------------------------------------
# 👤 የአስተዳዳሪ መረጃ (Admin Credentials)
# -------------------------------------------------------------------
# ለመጀመሪያ ጊዜ ሰርቨሩ ሲነሳ በራስ-ሰር የሚፈጠር የአስተዳዳሪ መረጃ
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password

# -------------------------------------------------------------------
# 👑 የዋና አስተዳዳሪ መረጃ (Super Admin Credentials)
# -------------------------------------------------------------------
# ለአስተዳዳሪዎች ማኔጅመንት የሚያገለግል የዋና አስተዳዳሪ መረጃ
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_strong_superadmin_password
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env ፋይል በተሳካ ሁኔታ ተፈጥሯል!');
  console.log(`ቦታው: ${envPath}`);
  console.log('አሁን በ .env ፋይል ውስጥ ያሉትን ምሳሌዎች (placeholders) በትክክለኛ መረጃዎ ይሙሉ!');
} catch (err) {
  console.error('❌ ፋይሉን መፍጠር አልተቻለም:', err);
}