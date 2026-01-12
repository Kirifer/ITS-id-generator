const express = require("express");
const adminRoutes = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, filterAdmins } = require("../controllers/adminController");


adminRoutes.get(
  "/filter",
  verifyToken,
  requireRole("Admin"),
  filterAdmins
);

adminRoutes.get(
  "/",
  verifyToken,
  requireRole("Admin"),
  getAllAdmins
);

adminRoutes.get(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  getAdminById
);

adminRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  createAdmin
);

adminRoutes.patch(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  updateAdmin
);

adminRoutes.delete(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  deleteAdmin
);



module.exports = {
    adminRoutes
}