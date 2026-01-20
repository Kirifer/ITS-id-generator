const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const PHOTOS_DIR = path.join(__dirname, "..", "uploads", "photos");
fs.mkdirSync(PHOTOS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PHOTOS_DIR),
  filename: (_req, file, cb) =>
    cb(null, `temp-${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

const addLeftPadding = async (req, res, next) => {
  const paddingWidth = 100;

  try {
    if (req.files) {
      for (const fieldName in req.files) {
        const filesArray = req.files[fieldName];
        
        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];
          const tempPath = file.path;
          const finalFilename = file.filename.replace('temp-', '');
          const finalPath = path.join(PHOTOS_DIR, finalFilename);

          await sharp(tempPath)
            .ensureAlpha()
            .extend({
              top: 0,
              bottom: 0,
              left: paddingWidth,
              right: 0,
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toFile(finalPath);

          fs.unlinkSync(tempPath);

          file.filename = finalFilename;
          file.path = finalPath;
        }
      }
    }
    
    if (req.file) {
      const tempPath = req.file.path;
      const finalFilename = req.file.filename.replace('temp-', '');
      const finalPath = path.join(PHOTOS_DIR, finalFilename);

      await sharp(tempPath)
        .ensureAlpha()
        .extend({
          top: 0,
          bottom: 0,
          left: paddingWidth,
          right: 0,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(finalPath);

      fs.unlinkSync(tempPath);

      req.file.filename = finalFilename;
      req.file.path = finalPath;
    }

    next();
  } catch (err) {
    if (req.files) {
      for (const fieldName in req.files) {
        req.files[fieldName].forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
    }
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ message: "Error processing image" });
  }
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large. Maximum allowed file size is 4MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  
  next();
};

module.exports = { upload, addLeftPadding, handleMulterError };