const express = require("express");
const dashboardRoutes = express.Router();
const { verifyToken, requireAnyRole } = require("../middleware/authMiddleware");
const { getIdCardStats } = require("../controllers/dashboardController");

dashboardRoutes.get(
  "/",
  verifyToken,
  requireAnyRole("Admin", "Approver"),
  getIdCardStats
);


module.exports = {
    dashboardRoutes
}