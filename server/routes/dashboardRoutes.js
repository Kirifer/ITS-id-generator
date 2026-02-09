const express = require("express");
const dashboardRoutes = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getIdCardStats } = require("../controllers/dashboardController");

dashboardRoutes.get("/", verifyToken, requireRole("Admin"), getIdCardStats);

module.exports = {
  dashboardRoutes,
};
