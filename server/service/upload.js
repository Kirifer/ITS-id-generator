const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

console.log("🪣 AWS BUCKET =", process.env.AWS_BUCKET_NAME);
console.log("🌏 AWS REGION =", process.env.AWS_REGION);

// Create S3 instance
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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

  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit

  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

// Error handler
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
