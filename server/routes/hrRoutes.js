const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { upload, handleMulterError } = require("../service/upload");
const {
  getHrList,
  getHrById,
  createHr,
  patchHr,
  deleteHr,
} = require("../controllers/hrController");

const hrRoutes = express.Router();

hrRoutes.get("/", verifyToken, requireRole("Admin"), getHrList);

hrRoutes.get("/:id", verifyToken, requireRole("Admin"), getHrById);

hrRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  upload.fields([{ name: "signature", maxCount: 1 }]),
  handleMulterError,
  createHr,
);

hrRoutes.patch(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  upload.fields([{ name: "signature", maxCount: 1 }]),
  handleMulterError,
  patchHr,
);

hrRoutes.delete("/:id", verifyToken, requireRole("Admin"), deleteHr);

module.exports = hrRoutes;
