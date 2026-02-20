// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // To allow cross-origin requests
const Admin = require('./models/Admin'); // Admin ሞዴልን ማስገባት

// Service ሞዴልን ለመጥራት (ፋይሉ ካለ)
let Service;
try {
  Service = require('./models/Service');
} catch (error) {
  console.log('⚠️ Service model not found. Skipping service seeding.');
}

// Load env vars
const envPath = path.resolve(__dirname, '.env');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  // Only show warning if not in production (in production, vars are usually injected)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`\n⚠️  ማስጠንቀቂያ: .env ፋይል አልተገኘም!`);
    console.error(`ተፈላጊው ቦታ: ${envPath}\n`);
  }
} else {
  console.log(`✅ .env ፋይል ተገኝቷል እና ተነቧል። JWT_SECRET: ${process.env.JWT_SECRET ? 'አለ' : 'የለም'}`);
}

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
        await Admin.create({
          email: process.env.ADMIN_EMAIL,
          // ሞዴሉ በራሱ hash ስለሚያደርግ፣ plain text እንልካለን
          password: process.env.ADMIN_PASSWORD,
          role: 'admin'
        });
        console.log(`✅ Admin created automatically: ${process.env.ADMIN_EMAIL}`);
      }
    } catch (error) {
      console.error('Auto-seeding failed:', error.message);
    }
  } else {
    console.log('⚠️ Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set. (This is expected if not configured in Dashboard)');
  }
};
seedAdmin(); // ሰርቨሩ ሲነሳ ይህን ፈንክሽን ጥራ
// ---------------------------------------------------

// --- Auto-Seed Services (አገልግሎቶችን ወደ ዳታቤዝ ለመጨመር) ---
const seedServices = async () => {
  // Service ሞዴሉ መኖሩን ማረጋገጥ
  if (!Service) return;
  
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      const services = [
        { name: 'Signature Facials', description: 'Customized facials that target your specific skin concerns, leaving you with a radiant glow.', icon: 'fas fa-spa' },
        { name: 'Dermaplaning', description: 'Advanced treatments to reduce fine lines and wrinkles, restoring your skin\'s youthful vitality.', icon: 'fas fa-magic' },
        { name: 'Microneedling', description: 'Stimulates collagen production to improve skin texture and reduce scars.', icon: 'fas fa-leaf' },
        { name: 'Chemical Peels', description: 'Exfoliates the skin to treat acne, scars, and discoloration.', icon: 'fas fa-leaf' },
        { name: 'Hydra Facial', description: 'Cleanses, extracts, and hydrates the skin using super serums.', icon: 'fas fa-leaf' },
        { name: 'BB Glowing', description: 'Semi-permanent foundation treatment for glowing, even-toned skin.', icon: 'fas fa-leaf' },
        { name: 'Microdermabrasion', description: 'Exfoliates dead skin cells to reveal a brighter complexion.', icon: 'fas fa-leaf' },
        { name: 'Nano Infusions', description: 'Non-invasive treatment to enhance product absorption and skin hydration.', icon: 'fas fa-leaf' },
        { name: 'Waxing Services', description: 'Professional hair removal for smooth and silky skin.', icon: 'fas fa-leaf' }
      ];
      
      await Service.insertMany(services);
      console.log('✅ Services seeded automatically');
    }
  } catch (error) {
    console.error('⚠️ Service auto-seeding failed:', error.message);
  }
};
seedServices(); // ሰርቨሩ ሲነሳ ይህን ፈንክሽን ጥራ
// ---------------------------------------------------




const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://shega-skin-studio.vercel.app", // Vercel የሰጠዎትን ትክክለኛ ሊንክ እዚህ ያረጋግጡ
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