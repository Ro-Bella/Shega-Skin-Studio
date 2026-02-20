// backend/adminSeeder.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // dotenv ላይብረሪ ትክክለኛውን ፋይል እንዲያነብ
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Admin ሞዴልን እናስገባለን
const connectDB = require('./config/db'); // የዳታቤዝ ግንኙነት ፋንክሽንን ከዋናው ኮድ ጋር ለመጋራት

const seedAdmins = async () => {
  await connectDB();

  try {
    const salt = await bcrypt.genSalt(10);

    // 1. Regular Admin (መደበኛ አድሚን)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
    }

    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    await Admin.findOneAndUpdate(
      { email: adminEmail },
      { email: adminEmail, password: hashedAdminPassword, role: 'admin' },
      { new: true, upsert: true }
    );
    console.log(`✅ Regular Admin Created/Updated:\n   Email: ${adminEmail}\n   Password: ${adminPassword}`);

    // 2. Super Admin (ለ Admin Management የሚሆን)
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    
    // በ .env ላይ ያለው ፓስወርድ Hash የተደረገ ከሆነ ለጊዜው 'password123' እንጠቀማለን
    let superAdminPassword = '';
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