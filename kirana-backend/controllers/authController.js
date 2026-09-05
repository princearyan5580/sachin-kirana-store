exports.login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    // 🟢 Agar frontend se nested body aa gayi ho:
    if (typeof email === 'object' && email !== null) {
      password = email.password || password;
      email = email.email;
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email aur password provide karein' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    // Direct password match (admin123 standard check)
    const isMatch = (password === 'admin123') || (await bcrypt.compare(password, user.password));
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