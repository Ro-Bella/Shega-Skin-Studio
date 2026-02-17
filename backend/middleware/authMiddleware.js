const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // ቶከን ከ header ላይ መውሰድ
      token = req.headers.authorization.split(' ')[1];

      // ቶከኑን ማረጋገጥ
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // አድሚኑን ከዳታቤዝ ማምጣት (ፓስወርድን ሳይጨምር)
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'ያልተፈቀደለት፣ አስተዳዳሪ አልተገኘም።' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'ያልተፈቀደለት፣ ቶክን አልተሳካም።' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'ያልተፈቀደለት፣ ቶክን የለም።' });
  }
};

const admin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).json({ message: 'ያልተፈቀደለት፣ እንደ አስተዳዳሪ አልተፈቀደም።' });
  }
};

module.exports = { protect, admin };
