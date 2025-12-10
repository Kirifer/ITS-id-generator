// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/** Verify JWT and attach decoded user to req.user */
const verifyToken = (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const token = h.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/** Require exactly one role */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ success: false, message: 'Access denied: Insufficient role' });
  }
  next();
};

/** Allow any of these roles */
const requireAnyRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied: Insufficient role' });
  }
  next();
};

module.exports = { verifyToken, requireRole, requireAnyRole };
