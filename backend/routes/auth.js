const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware for logging requests
const validateRequest = (req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.path}`, req.body);
  next();
};

// =======================
// Email/Password Login
// =======================
router.post('/login', validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 🚨 Restrict Employee/Intern from login
    if (user.role === 'Employee' || user.role === 'Intern') {
      return res.status(403).json({ success: false, message: 'Employees/Interns cannot log in. Please use ID input instead.' });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please login with Google.' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
});

// =======================
// Google Sign-In Login
// =======================
router.post('/google', validateRequest, async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'No credential provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    // 🚨 Employees/Interns cannot log in via Google either
    if (user && (user.role === 'Employee' || user.role === 'Intern')) {
      return res.status(403).json({ success: false, message: 'Employees/Interns cannot log in. Please use ID input instead.' });
    }

    // If new user, default role = Approver (not Employee anymore)
    if (!user) {
      user = await User.create({
        email,
        googleId,
        role: 'Approver', // default to Approver when signing in via Google
        isActive: true
      });
      console.log('[Google] New Approver created:', user.email);
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
      console.log('[Google] Existing user updated with Google ID:', user.email);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed.', error: error.message });
  }
});

module.exports = router;
