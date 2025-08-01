const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and extract user info.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user data to request object
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to restrict route access to specific roles.
 * @param {string} role - Role name to authorize (e.g., 'Admin', 'HR', 'Employee')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient role',
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
};
