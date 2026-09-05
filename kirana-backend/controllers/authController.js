exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email aur password provide karein' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Agar user database me nahi hai, toh automatic Admin create kar do
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name: 'Sachin Store Admin',
        email: cleanEmail,
        password: hashedPassword,
        role: 'admin'
      });
    }

    // Direct password match (Bypass for testing & smooth access)
    const isMatch = (password === '12345678') || (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    // Hamesha admin role set rakhein
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
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