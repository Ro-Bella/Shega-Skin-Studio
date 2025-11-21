// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. ኢሜይል ለመላክ የሚያስችል Transporter መፍጠር
  // (ለ Gmail ምሳሌ ተጠቅመናል፤ እንደ SendGrid, Mailgun ያሉ ሌሎች አገልግሎቶችን መጠቀም ይችላሉ)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // ለ Gmail: "Less secure app access" ማንቃት ወይም "App Password" መጠቀም ያስፈልጋል
  });

  // 2. የኢሜይል አማራጮችን ማዘጋጀት (ተቀባይ፣ ርዕስ፣ መልዕክት)
  const mailOptions = {
    from: 'Shega Skin Studio <no-reply@shegastudio.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. ኢሜይሉን መላክ
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // ኢሜይል ባይላክም ቀጠሮው ስለተያዘ ስህተቱን እዚህ ጋር እናስተናግዳለን
  }
};

module.exports = sendEmail;

/*
ማሳሰቢያ:
የኢሜይል መረጃዎችን (EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD) በ .env ፋይል ውስጥ ማስቀመጥ ያስፈልጋል።
ለምሳሌ (ለ Gmail):
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=robitesf@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
*/

