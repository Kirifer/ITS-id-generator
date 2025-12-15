const express = require("express");
const { login, refresher, checkAuth } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const authRoutes = express.Router();

const logReq = (req, _res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[AUTH] ${req.method} ${req.path}`);
  }
  next();
};

authRoutes.post("/login", logReq, login);
authRoutes.post("/refresh-token", refresher);
authRoutes.get("/check", verifyToken, checkAuth)


module.exports = authRoutes;
