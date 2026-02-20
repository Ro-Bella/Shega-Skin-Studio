// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ይህ ፋንክሽን ከመጠራቱ በፊት .env ፋይል መጫኑን ያስባል
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ የዳታቤዝ ግንኙነት አልተሳካም: MONGO_URI አልተገኘም');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'shega-skin-studio' // ዳታቤዝ ስሙን እዚህ ጋር በግዴታ እናስቀምጣለን
    });

    console.log(`✅ MongoDB ተገናኝቷል: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ የ MongoDB ግንኙነት ስህተት: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
