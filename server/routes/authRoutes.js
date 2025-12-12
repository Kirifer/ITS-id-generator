const express = require("express");
const { loginUser } = require("../controllers/authController");

const authRoutes = express.Router();

const logReq = (req, _res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[AUTH] ${req.method} ${req.path}`);
  }
  next();
};

authRoutes.post("/login", logReq, loginUser);

module.exports = authRoutes;
