const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'እባክዎ ኢሜል ያስገቡ'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'እባክዎ ትክክለኛ ኢሜል ያስገቡ',
    ],
  },
  password: {
    type: String,
    required: [true, 'እባክዎ ፓስወርድ ያስገቡ'],
    select: false, // ፓስወርድን በነባሪነት አታምጣ
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ፓስወርድን ወደ ዳታቤዝ ከመግባቱ በፊት Hash ማድረግ
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT Token ማዘጋጀት (Sign)
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// የገባውን ፓስወርድ ከዳታቤዝ ጋር ማነፃፀር
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);