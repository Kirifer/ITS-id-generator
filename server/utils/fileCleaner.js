const fs = require("fs");
const path = require("path");

const SERVER_ROOT = path.join(__dirname, "..");

function fileCleaner(relativePath) {
  if (!relativePath) return;
  if (!relativePath.startsWith("/uploads/generated")) return;

  const fullPath = path.join(SERVER_ROOT, relativePath.replace(/^\//, ""));

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, () => {});
  }
}

module.exports = { fileCleaner };
