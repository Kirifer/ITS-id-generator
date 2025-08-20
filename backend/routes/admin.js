const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Admin login (username + password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password'); // ensure password is included
    if (!user || user.role !== 'Admin') {
      return res.status(401).json({ message: 'Invalid credentials or not an Admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example protected route
router.get('/dashboard', verifyToken, requireRole('Admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin dashboard', user: req.user });
});

module.exports = router;
