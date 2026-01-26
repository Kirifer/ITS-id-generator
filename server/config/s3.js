const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
});

const getPresignedUrl = async (s3Key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  };

  return await getSignedUrl(s3, new GetObjectCommand(params), {expiresIn: 3600});
};

module.exports = { s3, getPresignedUrl };