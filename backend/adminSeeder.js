// backend/adminSeeder.js
const mongoose = require('mongoose');
require('dotenv').config(); // dotenv ላይብረሪ ለመጠቀም
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Admin ሞዴልን እናስገባለን

// ከሞንጎዲቢ ዳታቤዝ ጋር መገናኘት
const MONGO_URI = process.env.MONGO_URI; // በ .env ፋይል ውስጥ ያለውን የዳታቤዝ አድራሻ እንጠቀማለን

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); 
    console.log('Successfully connected to MongoDB for seeding.');
  } catch (err) {
    console.error('Connection error', err);
    process.exit(1); // በስህተት ጊዜ ፕሮሰሱን እናቋርጣለን
  }
};

const changeAdminCredentials = async () => {
  await connectDB();

  try {
    // --- እዚህ ጋር ይቀይሩ ---
    const targetEmail = process.env.ADMIN_EMAIL || 'admin@example.com'; // .env ፋይል ውስጥ ያስቀምጡ
    const newPassword = process.env.ADMIN_PASSWORD || 'password123'; // .env ፋይል ውስጥ ያስቀምጡ
    // -------------------------

    if (!targetEmail || !newPassword) {
      console.log('እባክዎ ኢሜል እና ፓስወርድ ያስገቡ።');
      process.exit();
    }

    // ፓስወርዱን ሃሽ (hash) እናደርጋለን
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ኢሜሉ ካለ እናዘምነዋለን፣ ከሌለ አዲስ እንፈጥራለን (upsert: true)
    const admin = await Admin.findOneAndUpdate(
      { email: targetEmail },
      { email: targetEmail, password: hashedPassword },
      { new: true, upsert: true }
    );

    console.log('የአድሚን መረጃ በተሳካ ሁኔታ ተቀይሯል/ተፈጥሯል:');
    console.log(`   ኢሜል: ${admin.email}`);
    console.log('   ፓስወርድ: (የተደበቀ)');

    process.exit();
  } catch (error) {
    console.error('ስህተት ተፈጥሯል:', error);
    process.exit(1);
  }
};

changeAdminCredentials();