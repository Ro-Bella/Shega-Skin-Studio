const mongoose = require('mongoose'); // ሞንጎው አሰባሰብ ለመጠቀም

const connectDB = async () => { // ዳታቤዝ ግንኙነት ለመፍጠር
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // ወደ MongoDB መገናኘት

    console.log(`MongoDB Connected: ${conn.connection.host}`); // ግንኙነት ተሳክቷል መልእክት ማሳወቅ
  } catch (error) { // ስህተት ከተፈጠረ
    console.error(`Error: ${error.message}`); // ስህተት መልእክት ማሳወቅ
    process.exit(1); // ፕሮሰሱ በስህተት መውጣት
  }
};

module.exports = connectDB; // ሌሎች ፋይሎች ውስጥ ለመጠቀም ማስተናገድ