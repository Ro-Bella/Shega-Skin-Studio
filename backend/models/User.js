// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false, // የይለፍ ቃል ሲጠየቅ እንዳይመለስ
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin', // ለጊዜው ሁሉም አዲስ ተጠቃሚ አስተዳዳሪ እንዲሆን
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// የይለፍ ቃል ከመቀመጡ በፊት መመስጠር (hash)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// የይለፍ ቃል ማስጀመሪያ ቶክን ለመፍጠር የሚያስችል ዘዴ
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 ደቂቃዎች

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
