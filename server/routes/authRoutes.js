const express = require("express");
const { login, refresher } = require("../controllers/authController");

const authRoutes = express.Router();

const logReq = (req, _res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[AUTH] ${req.method} ${req.path}`);
  }
  next();
};

authRoutes.post("/login", logReq, login);
authRoutes.post("/refresh-token", refresher)


module.exports = authRoutes;
