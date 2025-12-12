// server/routes/idCardRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

const idCardRoutes = express.Router();

/* =========================
   Upload config
   ========================= */
const PHOTOS_DIR = path.join(__dirname, "..", "uploads", "photos");
fs.mkdirSync(PHOTOS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PHOTOS_DIR),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    // Rejecting the file (no server error) is better DX than throwing:
    if (!ok) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

/* =========================
   Public lookup (keep first)
   ========================= */
idCardRoutes.get("/by-id-number/:idNumber", getDetailIdCard);

/* =========================
   Create (Admin only)
   ========================= */
idCardRoutes.post(
  "/",
  verifyToken,
  requireRole("Admin"),
  upload.single("photo"),
  postIdCard
);

/* =========================
   List (Admin or Approver)
   ========================= */
idCardRoutes.get("/", verifyToken, requireAnyRole("Admin", "Approver"), getIdCard);

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
idCardRoutes.patch("/:id", verifyToken, requireRole("Admin"), patchIdCardDetails);

/* =========================
   Delete (Admin only)
   ========================= */
idCardRoutes.delete("/:id", verifyToken, requireRole("Admin"), deleteIdCard);

module.exports = idCardRoutes;
