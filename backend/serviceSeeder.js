// backend/serviceSeeder.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./config/db');
const Service = require('./models/Service'); // Service ሞዴል በ models ፎልደር ውስጥ እንዳለ ታሳቢ ተደርጓል

const services = [
  {
    name: 'Signature Facials',
    description: 'Customized facials that target your specific skin concerns.',
    icon: 'fas fa-spa'
  },
  {
    name: 'Dermaplaning',
    description: 'Exfoliates the skin and removes vellus hair.',
    icon: 'fas fa-magic'
  },
  {
    name: 'Microneedling',
    description: 'Stimulates collagen production to improve skin texture.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'Chemical Peels',
    description: 'Exfoliates the skin to treat acne, scars, and discoloration.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'Hidra Facial',
    description: 'Cleanses, extracts, and hydrates the skin using super serums.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'BB Glowing',
    description: 'Semi-permanent foundation treatment for glowing skin.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'Microderma Brasion',
    description: 'Exfoliates dead skin cells to reveal a brighter complexion.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'Nano Infusions',
    description: 'Non-invasive treatment to enhance product absorption.',
    icon: 'fas fa-leaf'
  },
  {
    name: 'Waxing Services',
    description: 'Professional hair removal for smooth and silky skin.',
    icon: 'fas fa-leaf'
  }
];

const importData = async () => {
  await connectDB();

  try {
    // ነባር አገልግሎቶችን ማጥፋት (ድግግሞሽ እንዳይኖር)
    await Service.deleteMany();
    
    // አዳዲስ አገልግሎቶችን ማስገባት
    await Service.insertMany(services);
    
    console.log('✅ Services Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
