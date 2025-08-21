const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// ========================
// Admin Login Route
// ========================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user and include password for comparison
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      console.log(`❌ No user found with username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'Admin') {
      console.log(`❌ User ${username} is not an Admin`);
      return res.status(401).json({ message: 'Invalid credentials or not an Admin' });
    }

    if (!user.isActive) {
      console.log(`❌ User ${username} account is inactive`);
      return res.status(403).json({ message: 'Account inactive' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for ${username}:`, isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
    });
  } catch (err) {
    console.error('Server error during admin login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// Protected Admin Dashboard
// ========================
router.get('/dashboard', verifyToken, requireRole('Admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin dashboard', user: req.user });
});

module.exports = router;
