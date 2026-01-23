const s3 = require("../config/s3")
const crypto = require("crypto")
const IdCard = require("../models/IdCard");


const normalizePhone = (value) => {
  if (!value) return value;

  const phone = value.replace(/[^\d+]/g, "");

  if (phone.startsWith("+639")) return "0" + phone.slice(3);
  if (/^09\d{9}$/.test(phone)) return phone;

  throw new Error(
    "Invalid phone number format. Use 09XXXXXXXXX or +639XXXXXXXXX."
  );
};


const generateUniqueIdNumber = async () => {
  let idNumber;
  let exists = true;

  while (exists) {
    const digits = crypto
      .randomInt(1_000_000_000, 10_000_000_000)
      .toString();

    idNumber = `ITS-${digits}`;
    exists = await IdCard.exists({ idNumber });
  }

  return idNumber;
};

const deleteFromS3 = async (key) => {
  if (!key) return;

  try {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise();
  } catch (err) {
    console.error("S3 delete failed:", err.message);
  }
};


module.exports = {normalizePhone, generateUniqueIdNumber, deleteFromS3}