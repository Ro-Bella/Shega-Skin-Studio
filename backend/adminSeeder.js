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

const seedAdmins = async () => {
  await connectDB();

  try {
    const salt = await bcrypt.genSalt(10);

    // 1. Regular Admin (መደበኛ አድሚን)
    const adminEmail = process.env.ADMIN_EMAIL || 'robitesf@example.com'; // ወደሚፈልጉት ኢሜል ተቀይሯል
    const adminPassword = process.env.ADMIN_PASSWORD || 'shega123';   // ወደሚፈልጉት ፓስወርድ ተቀይሯል
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    await Admin.findOneAndUpdate(
      { email: adminEmail },
      { email: adminEmail, password: hashedAdminPassword, role: 'admin' },
      { new: true, upsert: true }
    );
    console.log(`✅ Regular Admin Created/Updated:\n   Email: ${adminEmail}\n   Password: ${adminPassword}`);

    // 2. Super Admin (ለ Admin Management የሚሆን)
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'baby@example.com';
    
    // በ .env ላይ ያለው ፓስወርድ Hash የተደረገ ከሆነ ለጊዜው 'password123' እንጠቀማለን
    let superAdminPassword = 'shega123';
    if (process.env.SUPER_ADMIN_PASSWORD && !process.env.SUPER_ADMIN_PASSWORD.startsWith('$2b$')) {
        superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    }

    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, salt);

    await Admin.findOneAndUpdate(
      { email: superAdminEmail },
      { email: superAdminEmail, password: hashedSuperAdminPassword, role: 'superadmin' },
      { new: true, upsert: true }
    );
    console.log(`✅ Super Admin Created/Updated:\n   Email: ${superAdminEmail}\n   Password: ${superAdminPassword}`);

    process.exit();
  } catch (error) {
    console.error('ስህተት ተፈጥሯል:', error);
    process.exit(1);
  }
};

seedAdmins();