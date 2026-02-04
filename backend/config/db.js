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
      console.error('\n*** Authentication Failed (የማረጋገጫ ስህተት) ***');
      console.error('እባክዎ የሚከተሉትን ያረጋግጡ:');
      console.error('1. በ .env ፋይል ውስጥ ያለው Username እና Password ትክክል መሆናቸውን።');
      console.error('2. Password ውስጥ ልዩ ምልክቶች (@, :, #) ካሉ URL Encode መደረግ አለባቸው (ለምሳሌ @ ወደ %40)።');
      console.error('3. በ connection string መጨረሻ ላይ "?authSource=admin" መጨመር ይሞክሩ።\n');
    }
    
    process.exit(1); // ፕሮሰሱ በስህተት መውጣት
  }
};

module.exports = connectDB; // ሌሎች ፋይሎች ውስጥ ለመጠቀም ማስተናገድ