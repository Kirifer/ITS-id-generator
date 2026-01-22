// server/utils/fileCleaner.js

const AWS = require("aws-sdk");

// S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Delete file from S3 using stored key
 */
async function fileCleaner(s3Key) {
  if (!s3Key) return;

  try {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
      })
      .promise();
  } catch (err) {
    console.error("S3 delete failed:", err.message);
  }
}

module.exports = { fileCleaner };
