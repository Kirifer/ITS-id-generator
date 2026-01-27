const sharp = require("sharp");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function processPhotoByType(file, type) {
  try {
    const originalObject = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
      .promise();

    let processedBuffer = originalObject.Body;

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
    const newKey = `photos/padded-${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "_",
    )}`;

    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newKey,
        Body: processedBuffer,
        ContentType: "image/png",
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
      .promise();

    return {
      location: uploadResult.Location,
      key: newKey,
    };
  } catch (error) {
    console.error("Error processing photo:", error);
    throw new Error(`Failed to process photo: ${error.message}`);
  }
}

module.exports = { processPhotoByType };
