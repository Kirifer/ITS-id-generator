const express = require("express");
const filterRoutes = express.Router();

const {
  verifyToken,
  requireAnyRole,
} = require("../middleware/authMiddleware");
const { getFilteredIdCards } = require("../controllers/filterController");

filterRoutes.get(
  "/",
  verifyToken,
  requireAnyRole("Admin", "Approver"),
  getFilteredIdCards
);

module.exports = filterRoutes;
