// backend/controllers/userController.js
const User = require('../models/User');
const { getOne, getAll, updateOne, deleteOne } = require('./apiHandler');

// ለተጠቃሚው የራሱን መረጃ ለማግኘት
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// የተጠቃሚውን መረጃ ለማዘመን (የይለፍ ቃል ሳይጨምር)
exports.updateMe = async (req, res) => {
    // 1. የይለፍ ቃል ማዘመን ከፈለገ ስህተት እንልካለን
    if (req.body.password) {
        return res.status(400).json({ message: 'የይለፍ ቃል በዚህ መንገድ ሊቀየር አይችልም። እባክዎ /change-password ይጠቀሙ።' });
    }

    // 2. የተፈቀዱ መስኮችን ብቻ እናዘምነዋለን
    const filteredBody = { ...req.body };
    delete filteredBody.role; // ሚና መቀየር አይፈቀድም

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ተጠቃሚው የራሱን አካውንት እንዲሰርዝ (በእርግጥ እንዲሰረዝ ሳይሆን እንዲቦዝን)
exports.deleteMe = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false }); // active የሚባል መስክ በሞዴሉ ላይ መጨመር ያስፈልጋል

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ለአስተዳዳሪ ብቻ የሚሆኑ አጠቃላይ ተግባራት
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User); // የይለፍ ቃል በዚህ መቀየር አይቻልም
exports.deleteUser = deleteOne(User);
