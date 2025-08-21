const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Example protected Employee route
router.get('/dashboard', verifyToken, requireRole('employee'), (req, res) => {
  res.json({ message: 'Welcome to the Employee dashboard', user: req.user });
});

module.exports = router;
