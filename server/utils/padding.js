const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function processPhotoByType(file, type) {
  try {
    if (type === 'Employee') {
      const paddingWidth = 105;
      const originalPath = file.path;
      const paddedFilename = `padded-${file.filename}`;
      const paddedPath = path.join(path.dirname(originalPath), paddedFilename);

      await sharp(originalPath)
        .ensureAlpha()
        .extend({
          top: 0,
          bottom: 0,
          left: paddingWidth,
          right: 0,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(paddedPath);

      fs.unlinkSync(originalPath);

      return `/uploads/photos/${paddedFilename}`;
    }
    
    return `/uploads/photos/${file.filename}`;
  } catch (error) {
    console.error("Error processing photo:", error);
    throw new Error(`Failed to process photo: ${error.message}`);
  }
}

module.exports = { processPhotoByType };