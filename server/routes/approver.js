const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

const ciRegex = (str) => new RegExp(`^${str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
const logDebug = (...args) => {
  if (process.env.DEBUG_AUTH === '1') console.log('[ApproverAuth]', ...args);
};

router.post('/login', async (req, res) => {
  const identifier = String(req.body?.identifier || req.body?.username || req.body?.email || '').trim();
  const password = String(req.body?.password || '');

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/email and password are required' });
  }

  try {
    // Lookup by username OR email (case-insensitive)
    const query = identifier.includes('@')
      ? { email: ciRegex(identifier) }
      : { username: ciRegex(identifier) };

    const user = await User.findOne(query).select('+password +role +isActive +username +email');

    if (!user) {
      logDebug('No user found for', identifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Accept "Approver" and "Approver HR" from DB, normalize to "Approver" in token
    const rawRole = String(user.role || '');
    const isApprover =
      /^approver$/i.test(rawRole) || /^approver hr$/i.test(rawRole);

    if (!isApprover) {
      logDebug('User has non-Approver role:', rawRole);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      logDebug('User is inactive:', user.username || user.email);
      return res.status(403).json({ message: 'Account inactive' });
    }

    if (!user.password) {
      logDebug('User has no password set (likely Google-created user):', user.username || user.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prefer model method if present
    let passwordOk = false;
    if (typeof user.comparePassword === 'function') {
      passwordOk = await user.comparePassword(password);
    } else {
      passwordOk = await bcrypt.compare(password, user.password);
    }

    if (!passwordOk) {
      logDebug('Password mismatch for', identifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Normalize role in token so middleware requireRole('Approver') works
    const tokenRole = 'Approver';

    const token = jwt.sign(
      { id: user._id, role: tokenRole, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d', algorithm: 'HS256' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: tokenRole },
    });
  } catch (err) {
    console.error('Approver login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Approver Dashboard
router.get('/dashboard', verifyToken, requireRole('Approver'), (req, res) => {
  res.json({ message: 'Welcome to the Approver dashboard', user: req.user });
});

module.exports = router;
