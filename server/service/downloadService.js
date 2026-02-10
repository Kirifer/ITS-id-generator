const { s3 } = require("../config/s3");

const downloadFromS3 = async (key) => {
  try {
    if (!key) {
      throw new Error("S3 key is required");
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const data = await s3.getObject(params).promise();

    return {
      data: data.Body,
      contentType: data.ContentType || "image/png",
      contentLength: data.ContentLength,
      filename: key.split("/").pop(),
    };
  } catch (error) {
    console.error("❌ Failed to download from S3:", error);
    throw new Error("Failed to download image from S3");
  }
};

module.exports = { downloadFromS3 };
