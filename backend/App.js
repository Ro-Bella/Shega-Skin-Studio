// backend/app.js (Example)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // አዲሱን authRoutes እናስገባለን
const clientRoutes = require('./routes/clientRoutes'); // አዲሱን clientRoutes እናስገባለን
const serviceRoutes = require('./routes/serviceRoutes'); // አዲሱን serviceRoutes እናስገባለን
const appointmentRoutes = require('./routes/appointmentsRoutes');


// .env ፋይልን ከፕሮጀክቱ ስር (root) እንዲያነብ እናደርጋለን
dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors()); // CORS ን ማንቃት
app.use(express.json()); // JSON data ን ለመቀበል

// Database Connection
mongoose.connect(process.env.DATABASE_LOCAL, {
    // useNewUrlParser and useUnifiedTopology are deprecated
    useUnifiedTopology: true,
}).then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // የ authentication ራውቶችን መጠቀም
app.use('/api/clients', clientRoutes); // የደንበኛ ራውቶችን መጠቀም
app.use('/api/services', serviceRoutes); // የአገልግሎት ራውቶችን መጠቀም
app.use('/api/appointments', appointmentRoutes); // የቀጠሮ ራውቶችን መጠቀም

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
