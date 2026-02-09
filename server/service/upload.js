const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../config/s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (_req, file, cb) => {
      const cleanName = file.originalname.replace(/\s+/g, "_");
      cb(null, `photos/${Date.now()}-${cleanName}`);
    },
  }),

  limits: { fileSize: 4 * 1024 * 1024 },

  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum allowed file size is 4MB.",
      });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};

module.exports = { upload, handleMulterError };
