// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

/** Verify JWT and attach decoded user to req.user */
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Access Token not found." });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token or No token found." });
  }
};

/** Require exactly one role */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Insufficient role" });
  }
  next();
};

/** Allow any of these roles */
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
