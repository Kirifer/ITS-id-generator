// server/utils/padding.js

const sharp = require("sharp");
const AWS = require("aws-sdk");

// 🔴 S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function processPhotoByType(file, type) {
  try {
    // 🔴 DOWNLOAD ORIGINAL IMAGE FROM S3
    const originalObject = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
      .promise();

    let processedBuffer = originalObject.Body;

    // EMPLOYEE TYPE → ADD LEFT PADDING
    if (type === "Employee") {
      const paddingWidth = 105;

      processedBuffer = await sharp(processedBuffer)
        .ensureAlpha()
        .extend({
          top: 0,
          bottom: 0,
          left: paddingWidth,
          right: 0,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    }

    // 🔴 NEW FILE NAME FOR PADDED VERSION
    const newKey = `photos/padded-${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;

    // 🔴 UPLOAD PROCESSED IMAGE TO S3
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newKey,
        Body: processedBuffer,
        ContentType: "image/png",
      })
      .promise();

    // 🔴 DELETE ORIGINAL UPLOADED IMAGE (UNPADDED)
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
      .promise();

    // 🔴 RETURN S3 URL + KEY (CONTROLLER STORES BOTH)
    return {
      location: uploadResult.Location, // full S3 URL
      key: newKey,                     // S3 key
    };
  } catch (error) {
    console.error("Error processing photo:", error);
    throw new Error(`Failed to process photo: ${error.message}`);
  }
}

module.exports = { processPhotoByType };
