const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  loginApprover,
  dashboardApprover,
} = require("../controllers/approverController");

const approverRoutes = express.Router();

approverRoutes.post("/login", loginApprover);

approverRoutes.get(
  "/dashboard",
  verifyToken,
  requireRole("Approver"),
  dashboardApprover
);

module.exports = approverRoutes;
