// c:\Users\Robi\Desktop\shega\backend\hash_password.js
const bcrypt = require('bcryptjs');

async function hashSuperAdminPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('የተመሰጠረ የይለፍ ቃል (Hashed Password):', hashedPassword);
}

// እዚህ ጋር ሊጠቀሙበት የሚፈልጉትን የይለፍ ቃል ያስገቡ (ለምሳሌ፡ '12345678')
hashSuperAdminPassword('12345678');
