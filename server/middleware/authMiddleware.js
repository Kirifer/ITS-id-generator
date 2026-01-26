
const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  try {
   
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Access Token not found." });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    
    req.user = {
      id: decoded.id || decoded._id, 
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
