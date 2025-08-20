const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Approver login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'Approver') {
      return res.status(401).json({ message: 'Invalid credentials or not an Approver' });
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
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Approver login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example protected route
router.get('/dashboard', verifyToken, requireRole('Approver'), (req, res) => {
  res.json({ message: 'Welcome to the Approver dashboard', user: req.user });
});

module.exports = router;
