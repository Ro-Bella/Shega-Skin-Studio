// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // To allow cross-origin requests
const Admin = require('./models/Admin'); // Admin ሞዴልን ማስገባት
const bcrypt = require('bcryptjs'); // ለይለፍ ቃል Hash ለማድረግ

// Load env vars
dotenv.config({ path: path.resolve(__dirname, './.env') }); // Loads .env file from the backend folder

// Check for critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  console.error('Please set JWT_SECRET in your .env file or Render dashboard.');
}

const connectDB = require('./config/db'); // MongoDB connection

// Connect to database
connectDB();

// --- Auto-Seed Admin (ለ Render Free Tier መፍትሄ) ---
const seedAdmin = async () => {
  // Environment variables መኖራቸውን ማረጋገጥ
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    try {
      const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        // አድሚን ከሌለ መፍጠር (Admin ሞዴል ፓስወርዱን በራሱ Hash ያደርገዋል)
        // ማሳሰቢያ: Admin ሞዴል pre-save hook ከሌለው፣ እዚህ ጋር hash ማድረግ ያስፈልጋል
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        await Admin.create({
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin'
        });
        console.log(`✅ Admin created automatically: ${process.env.ADMIN_EMAIL}`);
      }
    } catch (error) {
      console.error('Auto-seeding failed:', error.message);
    }
  } else {
    console.log('⚠️ Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables.');
  }
};
seedAdmin(); // ሰርቨሩ ሲነሳ ይህን ፈንክሽን ጥራ
// ---------------------------------------------------

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://shega-skin-studio.vercel.app", // Vercel የሰጠዎትን ትክክለኛ ሊንክ እዚህ ያረጋግጡ
    "https://shega-skin-studio-2018.vercel.app", // እዚህ ጋር የቀየሩትን አዲስ ሊንክ ያስገቡ (ለምሳሌ፡ https://my-new-name.vercel.app)
    "https://shega-skin-studio-2df3.vercel.app", // አዲሱ የ Vercel ዶሜይን
    process.env.FRONTEND_URL // ወይም Render ላይ ይህንን variable መሙላት ይችላሉ
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Import routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const { notFound, errorHandler } = require('./errorMiddleware');

// Mount routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);



// Root route to show server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Ignore favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => res.status(204));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}

module.exports = app;