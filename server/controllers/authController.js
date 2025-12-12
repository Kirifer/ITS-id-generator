const jwt = require('jsonwebtoken');
const User = require('../models/User');


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Include password for comparison
    const user = await User.findOne({ email }).select("+password");

    // Generic messages to avoid account enumeration
    if (!user || !user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Optional policy: block these roles from logging in
    if (user.role === "Employee" || user.role === "Intern") {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Employees/Interns cannot log in. Please use ID input instead.",
        });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account is inactive" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h", algorithm: "HS256" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};


module.exports = {
    loginUser
}