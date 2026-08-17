// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing!" });
    }

    // Token Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User account not found!" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token failed or expired!" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied: Admin only!" });
  }
};

module.exports = { protect, admin };