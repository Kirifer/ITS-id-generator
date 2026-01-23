const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const getPresignedUrl = (s3Key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Expires: 3600,
  };

  return s3.getSignedUrl("getObject", params);
};

module.exports = { s3, getPresignedUrl };