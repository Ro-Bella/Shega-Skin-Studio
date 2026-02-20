// backend/config/db.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
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
