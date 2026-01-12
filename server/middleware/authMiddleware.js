// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

/**
 * Verify JWT from cookies and attach normalized user to req.user
 */
const verifyToken = (req, res, next) => {
  try {
    // 🔐 Read token from cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Access Token not found." });
    }

    // 🔓 Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ NORMALIZE USER OBJECT (THIS FIXES YOUR ERROR)
    req.user = {
      id: decoded.id || decoded._id, // <-- IMPORTANT FIX
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token or expired token." });
  }
};


const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Insufficient role" });
  }
  next();
};


const requireAnyRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Insufficient role" });
    }
    next();
  };

module.exports = { verifyToken, requireRole, requireAnyRole };
