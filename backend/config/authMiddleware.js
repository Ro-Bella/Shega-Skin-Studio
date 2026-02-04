// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// የተጠቃሚን ጥያቄ መጠበቅ
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // ቶክኑን ከሄደር ላይ መውሰድ ( 'Bearer <token>' )
      token = req.headers.authorization.split(' ')[1];

      // ቶክኑን ማረጋገጥ
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ተጠቃሚውን ከዳታቤዝ መፈለግ እና ከጥያቄው ጋር ማያያዝ
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'ተጠቃሚው አልተገኘም' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'ያልተፈቀደ ጥያቄ፣ ቶክኑ አልተገኘም ወይም የተሳሳተ ነው' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'ያልተፈቀደ ጥያቄ፣ ቶክን አልተገኘም' });
  }
};