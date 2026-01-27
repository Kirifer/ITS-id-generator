const express = require("express");
const s3Routes = express.Router();
const { downloadFromS3 } = require("../service/downloadService");
const { getPresignedUrl } = require("../config/s3");


s3Routes.get("/url", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: "S3 key is required" });
    }

    const presignedUrl = getPresignedUrl(key);
    
    res.json({ url: presignedUrl });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    res.status(500).json({ error: "Failed to generate image URL" });
  }
});


s3Routes.get("/download", async (req, res) => {
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

module.exports = s3Routes;