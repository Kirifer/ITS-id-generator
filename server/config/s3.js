const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  signatureVersion: 'v4', 
});

const getPresignedUrl = async (s3Key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Expires: expiresIn,
  };

  return await getSignedUrl(s3, new GetObjectCommand(params));
};

module.exports = { s3, getPresignedUrl };