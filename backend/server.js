const app = require('./App');
const dotenv = require('dotenv');
const appointmentRoutes = require('./routes/appointmentsRoutes');


// .env ፋይልን ለማንበብ (ይህ ከ App.js በፊት መሆን አለበት)
dotenv.config();

// የሰርቨር ማስጀመሪያ
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
