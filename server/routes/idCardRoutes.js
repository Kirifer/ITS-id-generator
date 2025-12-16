// server/routes/idCardRoutes.js

const express = require("express");
const {
  verifyToken,
  requireRole,
  requireAnyRole,
} = require("../middleware/authMiddleware");
const {
  getDetailIdCard,
  postIdCard,
  getIdCard,
  patchIdCardApprove,
  patchIdCardReject,
  patchIdCardDetails,
  deleteIdCard,
} = require("../controllers/idCardController");
const { upload } = require("../service/upload");

const idCardRoutes = express.Router();

/* =========================
   Public lookup (keep first)
   ========================= */
idCardRoutes.get("/by-id-number/:idNumber", getDetailIdCard);

/* =========================
   Create (Admin only)
   - employee photo
   - HR signature
   ========================= */
idCardRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "hrSignature", maxCount: 1 },
  ]),
  postIdCard
);

/* =========================
   List (Admin or Approver)
   ========================= */
idCardRoutes.get(
  "/",
  verifyToken,
  requireAnyRole("Admin", "Approver"),
  getIdCard
);

/* =========================
   Approvals (Approver only)
   ========================= */
idCardRoutes.patch(
  "/:id/approve",
  verifyToken,
  requireRole("Approver"),
  patchIdCardApprove
);

idCardRoutes.patch(
  "/:id/reject",
  verifyToken,
  requireRole("Approver"),
  patchIdCardReject
);

/* =========================
   Update fields (Admin only)
   ========================= */
idCardRoutes.patch(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "hrSignature", maxCount: 1 },
  ]),
  patchIdCardDetails
);

/* =========================
   Delete (Admin only)
   ========================= */
idCardRoutes.delete(
  "/:id",
  verifyToken,
  requireRole("Admin"),
  deleteIdCard
);

module.exports = idCardRoutes;
