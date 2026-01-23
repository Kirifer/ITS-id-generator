const { s3 } = require("../config/s3");

const downloadFromS3 = async (s3Key) => {
  try {
    let key = s3Key;
    
    if (s3Key.startsWith('http://') || s3Key.startsWith('https://')) {
      const url = new URL(s3Key);
      key = url.pathname.substring(1);
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