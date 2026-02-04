const mongoose = require('mongoose'); // ሞንጎው አሰባሰብ ለመጠቀም

const connectDB = async () => { // ዳታቤዝ ግንኙነት ለመፍጠር
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI በ .env ፋይል ውስጥ አልተገኘም');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI); // ወደ MongoDB መገናኘት

    console.log(`MongoDB Connected: ${conn.connection.host}`); // ግንኙነት ተሳክቷል መልእክት ማሳወቅ
  } catch (error) { // ስህተት ከተፈጠረ
    console.error(`Error: ${error.message}`); // ስህተት መልእክት ማሳወቅ
    
    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.error('Authentication Failed: እባክዎ በ .env ፋይልዎ ውስጥ ያለውን የ MongoDB username እና password ያረጋግጡ።');
    }
    
    process.exit(1); // ፕሮሰሱ በስህተት መውጣት
  }
};

module.exports = connectDB; // ሌሎች ፋይሎች ውስጥ ለመጠቀም ማስተናገድ