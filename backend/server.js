// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // To allow cross-origin requests
const connectDB = require('./config/db'); // MongoDB connection
const port = process.env.PORT || 5000;


// Load env vars
dotenv.config({ path: path.resolve(__dirname, './.env') }); // Loads .env file from the backend folder

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://shega-skin-studio.vercel.app" // የእርስዎ Vercel ዌብሳይት
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Import routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const { authSuperAdmin } = require('./controllers/adminController'); // Import the specific controller

// Mount routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);

// Backend/index.js ወይም server.js ውስጥ

// የአገልግሎት ዝርዝሮችን የሚመልስ API
app.get('/api/services', (req, res) => {
  const services = [
    { _id: '1', name: 'የፊት ህክምና (Facial)' },
    { _id: '2', name: 'የቆዳ እንክብካቤ (Skin Care)' },
    { _id: '3', name: 'ሌዘር ህክምና (Laser Treatment)' },
    { _id: '4', name: 'ማሳጅ (Massage)' }
  ];
  res.json(services);
});


// Explicitly define the super-login route to fix the 404 error
app.post('/api/admin/super-login', authSuperAdmin);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

module.exports = app;