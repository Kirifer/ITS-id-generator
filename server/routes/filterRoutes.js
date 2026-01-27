const express = require("express");
const filterRoutes = express.Router();

const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getFilteredIdCards } = require("../controllers/filterController");

filterRoutes.get("/", verifyToken, requireRole("Admin"), getFilteredIdCards);

module.exports = filterRoutes;
