const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

module.exports = {upload}