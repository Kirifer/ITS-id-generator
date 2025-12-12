const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { loginAdmin, dashboardAdmin } = require("../controllers/adminController");

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdmin);

adminRoutes.get("/dashboard", verifyToken, requireRole("Admin"), dashboardAdmin);

module.exports = adminRoutes;
