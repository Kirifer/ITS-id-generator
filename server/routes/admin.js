const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Example protected admin route
router.get('/dashboard', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin dashboard', user: req.user });
});

module.exports = router;
