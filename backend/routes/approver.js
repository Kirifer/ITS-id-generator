const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Approver login (username + password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('=== Approver Login Attempt ===');
  console.log('Username:', username);
  console.log('Password provided:', password);

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      console.log('❌ No user found with that username');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.username, 'Role:', user.role, 'isActive:', user.isActive);

    if (user.role !== 'Approver') {
      console.log('❌ User is not an Approver');
      return res.status(401).json({ message: 'Invalid credentials or not an Approver' });
    }

    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return res.status(403).json({ message: 'Account inactive' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example protected route
router.get('/dashboard', verifyToken, requireRole('Approver'), (req, res) => {
  res.json({ message: 'Welcome to the Approver dashboard', user: req.user });
});

module.exports = router;
