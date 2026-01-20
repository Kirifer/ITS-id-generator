// server/routes/idCardRoutes.js

const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  getDetailIdCard,
  postIdCard,
  getIdCard,
  patchIdCardApprove,
  patchIdCardReject,
  patchIdCardDetails,
  deleteIdCard,
} = require("../controllers/idCardController");
const {
  upload,
  handleMulterError,
} = require("../service/upload");

const idCardRoutes = express.Router();

/* =========================
   Public lookup (Approved IDs only)
   Uses EMPLOYEE NUMBER (front of ID)
   Example: ITS-00003
========================= */
idCardRoutes.get("/by-employee-number/:employeeNumber", getDetailIdCard);

/* =========================
   Create ID (Admin only)
   - employee photo
   - HR signature (only for manual HR)
========================= */
idCardRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "hrSignature", maxCount: 1 },
  ]),
  handleMulterError,
  postIdCard,
);

idCardRoutes.get("/", verifyToken, requireRole("Admin"), getIdCard);

idCardRoutes.patch(
  "/:id/approve",
  verifyToken,
  requireRole("Admin"),
  patchIdCardApprove,
);

idCardRoutes.patch(
  "/:id/reject",
  verifyToken,
  requireRole("Admin"),
  patchIdCardReject,
);

/* =========================
   Update ID fields (Admin only)
========================= */
idCardRoutes.patch(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "hrSignature", maxCount: 1 },
  ]),
  patchIdCardDetails,
);

/* =========================
   Delete ID (Admin only)
========================= */
idCardRoutes.delete("/:id", verifyToken, requireRole("Admin"), deleteIdCard);

module.exports = idCardRoutes;
