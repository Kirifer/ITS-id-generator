const express = require("express");
const downloadRoutes = express.Router();
const { downloadFromS3 } = require("../service/downloadService");

downloadRoutes.get("/download", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: "S3 key is required" });
    }

    const fileData = await downloadFromS3(key);

    res.setHeader("Content-Type", fileData.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileData.filename}"`
    );
    res.setHeader("Content-Length", fileData.contentLength);
    res.setHeader("Cache-Control", "no-cache");


    res.send(fileData.data);

  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to download image" });
  }
});

module.exports = downloadRoutes;