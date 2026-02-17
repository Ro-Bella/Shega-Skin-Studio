// backend/controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.authAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = admin.getSignedJwtToken();
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
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminHashedPassword = process.env.SUPER_ADMIN_PASSWORD; // This should be a hashed password
    
    if (!superAdminEmail || !superAdminHashedPassword) {
      console.error('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD environment variables are not set.');
      return res.status(500).json({ messageKey: 'serverError' });
    }

    // In a real app, you might want a separate SuperAdmin model or a flag on the Admin model.
    // For this setup, we compare against env variables.
    // The password in .env should be hashed. Let's assume it is for this comparison.
    console.log('የገባው ኢሜል:', email, 'ትክክለኛው ኢሜል:', superAdminEmail);
    console.log('የይለፍ ቃል ማነፃፀርን በመሞከር ላይ...');
    
    let isMatch = false;
    // የይለፍ ቃሉ bcrypt hash መሆኑን ማረጋገጥ (በ $2 ይጀምራል)
    if (superAdminHashedPassword.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, superAdminHashedPassword);
    } else {
      // ካልሆነ እንደ Plain Text ማነፃፀር (ለ Development ምቹ ነው)
      isMatch = password === superAdminHashedPassword;
    }
    
    console.log('የይለፍ ቃል ማነፃፀር ውጤት (isMatch):', isMatch);
    
    if (email === superAdminEmail && isMatch) {
      console.log('የበላይ አስተዳዳሪ ማረጋገጫ ተሳክቷል።');
      res.status(200).json({ 
        message: 'Super admin authenticated successfully.',
        messageKey: 'superAdminAuthSuccess' // For frontend translation
      });
    } else {
      console.log('የበላይ አስተዳዳሪ ማረጋገጫ አልተሳካም።');
      if (email !== superAdminEmail) console.log('ምክንያት: ኢሜል አልተጣጣመም።');
      if (!isMatch) console.log('ምክንያት: ፓስወርድ አልተጣጣመም።');
      res.status(401).json({ messageKey: 'superAdminAuthFailed' }); // Use messageKey for consistency
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            email,
            password: hashedPassword,
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
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
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