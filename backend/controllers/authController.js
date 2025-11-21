// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// ቶክን ለመፍጠር የሚያስችል ተግባር
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// ተጠቃሚ ሲገባ ቶክን የሚልክ ተግባር
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // የይለፍ ቃል እንዳይመለስ
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

// አስተዳዳሪ ለመግባት
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ!' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል' });
    }

    createSendToken(user, 200, res);
};

// የይለፍ ቃል ረሳሁ ተግባር
exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: 'በዚህ ኢሜይል የተመዘገበ ተጠቃሚ የለም።' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const message = `የይለፍ ቃልዎን ዳግም ለማስጀመር ይህንን ሊንክ ይጫኑ: ${resetURL}\nይህ ሊንክ ለ10 ደቂቃ ብቻ የሚሰራ ነው።`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'የይለፍ ቃል ዳግም ማስጀመሪያ ሊንክ (ከ10 ደቂቃ በኋላ ጊዜው ያበቃል)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'የይለፍ ቃል ማስጀመሪያ ሊንክ ወደ ኢሜይልዎ ተልኳል።',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'ኢሜይሉን በመላክ ላይ ስህተት ተፈጥሯል። እባክዎ ቆይተው ይሞክሩ።' });
    }
};

// የይለፍ ቃል ዳግም ማስጀመር ተግባር
exports.resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'ቶክኑ ትክክል አይደለም ወይም ጊዜው አልፏል።' });
    }

    if (req.body.password.length < 8) {
        return res.status(400).json({ message: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት።' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
};

// የይለፍ ቃል ለመቀየር (አሁን የገባ ተጠቃሚ)
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // 1. ተጠቃሚውን ከዳታቤዝ ያግኙ (የይለፍ ቃሉን ጨምሮ)
    const user = await User.findById(req.user.id).select('+password');

    // 2. የአሁኑ የይለፍ ቃል ትክክል መሆኑን ያረጋግጡ
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ message: 'የአሁኑ የይለፍ ቃል ትክክል አይደለም።' });
    }

    // 3. አዲሱን የይለፍ ቃል ያዘምኑ
    user.password = newPassword;
    await user.save(); // pre('save') hook የይለፍ ቃሉን በራስ-ሰር ይመስጥራል

    // 4. አዲስ ቶክን ይፍጠሩ እና ይላኩ
    createSendToken(user, 200, res);
};

// ተጠቃሚው መግባቱን የሚያረጋግጥ middleware
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'እባክዎ ለመግባት ይግቡ።' });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({ message: 'ይህ ቶክን ያለው ተጠቃሚ የለም።' });
    }

    req.user = currentUser;
    next();
};

// አዲስ አስተዳዳሪ ለመመዝገብ (በነባር አስተዳዳሪ ብቻ)
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // አዲስ ተጠቃሚ እንፈጥራለን (ሚናው በነባሪ 'admin' ይሆናል)
        const newUser = await User.create({
            email,
            password,
            role: 'admin' // ሚናውን እዚህ ላይ እናስቀምጣለን
        });

        createSendToken(newUser, 201, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
