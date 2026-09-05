exports.login = async (req, res) => {
  console.log("👉 Incoming Login Body:", req.body); // 👈 Ye exact payload dikhayega

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password in request body");
      return res.status(400).json({ success: false, message: 'Email aur password provide karein' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log("❌ User not found for email:", cleanEmail);
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    // Direct match check (Atlas document se bcrypt compare)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("👉 Password match status:", isMatch);

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
    console.error("Login Controller Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};