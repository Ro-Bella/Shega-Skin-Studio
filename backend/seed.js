// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // የ User ሞዴል ዱካ

// .env ፋይልን መጫን
dotenv.config({ path: './.env' });

// የዳታቤዝ ግንኙነት
const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB)
  .then(() => {
    console.log('DB connection successful for seeding!');
    seedAdmin();
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

const seedAdmin = async () => {
  try {
    // በ .env ፋይል ውስጥ የተጠቀሰው አስተዳዳሪ መኖሩን ማረጋገጥ
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log('Admin user already exists. No action taken.');
      process.exit();
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('Please provide ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
      process.exit(1);
    }

    // አዲስ አስተዳዳሪ መፍጠር
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('✅ Default admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

