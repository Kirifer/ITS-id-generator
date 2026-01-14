const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  createPosition,
  getPositions,
  getAllPositions,
  patchPosition,
  deletePosition,
} = require("../controllers/positionController");
const positionRoutes = express.Router();

positionRoutes.post("/", verifyToken, requireRole("Admin"), createPosition);
positionRoutes.get("/", verifyToken, requireRole("Admin"), getPositions);
positionRoutes.get("/all", verifyToken, requireRole("Admin"), getAllPositions);
positionRoutes.patch("/:id", verifyToken, requireRole("Admin"), patchPosition);
positionRoutes.delete("/:id", verifyToken, requireRole("Admin"), deletePosition);

module.exports = { positionRoutes };
