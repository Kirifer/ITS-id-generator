const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Example protected HR route
router.get('/dashboard', verifyToken, requireRole('hr'), (req, res) => {
  res.json({ message: 'Welcome to the HR dashboard', user: req.user });
});

module.exports = router;
