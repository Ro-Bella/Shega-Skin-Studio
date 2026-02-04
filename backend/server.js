// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // To allow cross-origin requests

// Load env vars
dotenv.config({ path: path.resolve(__dirname, './.env') }); // Loads .env file from the backend folder

const connectDB = require('./config/db'); // MongoDB connection

// Connect to database
connectDB();

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

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}

module.exports = app;