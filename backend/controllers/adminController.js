// backend/controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Fallback token generation

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.authAdmin = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check JWT_SECRET first
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    return res.status(500).json({ message: 'Server Configuration Error (JWT_SECRET)', messageKey: 'serverError' });
  }

  try {
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ messageKey: 'invalidCredentials' });
    }

    // 2. Robust Password Check
    let isMatch = false;
    // Try model method first
    if (typeof admin.matchPassword === 'function') {
      try {
        isMatch = await admin.matchPassword(password);
      } catch (err) {
        console.warn('admin.matchPassword failed, trying fallback:', err.message);
      }
    }
    
    // Fallback: Manual check (handles plain text or missing model method)
    if (!isMatch && admin.password) {
        if (admin.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, admin.password);
        } else if (admin.password === password) {
            isMatch = true; // Plain text match (for legacy/seeded data)
        }
    }

    if (isMatch) {
      // 3. Token Generation
      let token;
      if (typeof admin.getSignedJwtToken === 'function') {
        token = admin.getSignedJwtToken();
      } else {
        token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      }

      res.json({
        _id: admin._id,
        email: admin.email,
        token,
        messageKey: 'adminLoginSuccess', // መልዕክቱን ከቋንቋ ፋይል ለማምጣት
      });
    } else {
      res.status(401).json({ messageKey: 'invalidCredentials' });
    }
  } catch (error) {
    console.error('Error during admin authentication:', error); // ለዲበጊንግ እንዲረዳ
    res.status(500).json({
      message: 'ሰርቨር ላይ ስህተት ተፈጥሯል',
      error: error.message,
    });
  }
};

// @desc    Auth super admin for management access
// @route   POST /api/admin/super-login
// @access  Public
exports.authSuperAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the admin by email from the database
        const admin = await Admin.findOne({ email }).select('+password');

        // 2. Check if admin exists and has the 'superadmin' role
        if (!admin || admin.role !== 'superadmin') {
            console.log('የበላይ አስተዳዳሪ ማረጋገጫ አልተሳካም: ኢሜል አልተገኘም ወይም ሚናው ትክክል አይደለም።');
            return res.status(401).json({ messageKey: 'superAdminAuthFailed' });
        }

        // 3. Check if the password matches
        const isMatch = await admin.matchPassword(password);

        if (isMatch) {
            console.log('የበላይ አስተዳዳሪ ማረጋገጫ ተሳክቷል።');
            res.status(200).json({
                message: 'Super admin authenticated successfully.',
                messageKey: 'superAdminAuthSuccess'
            });
        } else {
            console.log('የበላይ አስተዳዳሪ ማረጋገጫ አልተሳካም: ፓስወርድ አልተጣጣመም።');
            res.status(401).json({ messageKey: 'superAdminAuthFailed' });
        }
    } catch (error) {
        console.error('Error during super admin authentication:', error);
        res.status(500).json({
            message: 'ሰርቨር ላይ ስህተት ተፈጥሯል',
            messageKey: 'serverError',
            error: error.message,
        });
    }
};


// @desc    Register a new admin
// @route   POST /api/admin
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'እባክዎ ኢሜል እና ፓስወርድ ያስገቡ።' });
    }

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'ይህ ኢሜል አስቀድሞ ተመዝግቧል።' });
        }

        const admin = await Admin.create({
            email,
            password, // ሞዴሉ በራሱ Hash ስለሚያደርገው እዚህ ጋር ዝም ብለን እንልካለን
        });

        // Generate token for the newly created admin
        const token = admin.getSignedJwtToken();

        res.status(201).json({
            success: true,
            data: {
                _id: admin._id,
                email: admin.email,
                token, // Send token for new admin
            },
            message: 'አዲስ አስተዳዳሪ በተሳካ ሁኔታ ተፈጥሯል!',
        });
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Admin
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select('-password'); // ፓስወርድን ሳይጨምር
        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins // ዳታውን በ 'data' property ውስጥ እንልካለን
        });
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};

// @desc    Update admin credentials
// @route   PUT /api/admin/:id
// @access  Private/Admin
exports.updateAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: 'አስተዳዳሪው አልተገኘም' });
        }

        admin.email = email || admin.email;
        if (password) {
            admin.password = password; // The pre-save hook in the model will handle hashing
        }

        const updatedAdmin = await admin.save();

        res.json({
            success: true,
            // Select '-password' to exclude the password from the response
            data: {
                _id: updatedAdmin._id,
                email: updatedAdmin.email,
            },
            message: 'የአስተዳዳሪው መረጃ በተሳካ ሁኔታ ተቀይሯል!',
        });
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};

// @desc    Delete an admin
// @route   DELETE /api/admin/:id
// @access  Private/Admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: 'አስተዳዳሪው አልተገኘም' });
        }

        await admin.deleteOne();
        res.json({
            success: true,
            message: 'አስተዳዳሪው በተሳካ ሁኔታ ተሰርዟል'
        });
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};