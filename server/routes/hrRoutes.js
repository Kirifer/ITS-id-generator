const express = require("express");
const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");
const { upload, handleMulterError } = require("../service/upload");
const {
  getHrList,
  getHrById,
  createHr,
  patchHr,    
  deleteHr,
} = require("../controllers/hrController");

const hrRoutes = express.Router();

/* =========================
   GET ALL HR
========================= */
hrRoutes.get(
  "/",
  verifyToken,
  requireRole("Admin"),
  getHrList
);

/* =========================
   GET HR BY ID
========================= */
hrRoutes.get(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  getHrById
);

/* =========================
   CREATE HR
========================= */
hrRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  upload.fields([{ name: "signature", maxCount: 1 }]),
  handleMulterError,
  createHr
);

/* =========================
   UPDATE HR (PATCH)
========================= */
hrRoutes.patch(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  upload.fields([{ name: "signature", maxCount: 1 }]),
  handleMulterError,
  patchHr
);

/* =========================
   DELETE HR
========================= */
hrRoutes.delete(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  deleteHr
);

module.exports = hrRoutes;
