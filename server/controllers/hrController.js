// server/controllers/hrController.js

const sharp = require("sharp");
const mongoose = require("mongoose");
const Hr = require("../models/Hr");
const AWS = require("aws-sdk");

// Create S3 instance for deletes
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/* =========================
   GET ALL HR
========================= */
const getHrList = async (req, res) => {
  try {
    const hrs = await Hr.find().sort({ name: 1, position: 1 });

    return res.json({
      success: true,
      data: hrs,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

/* =========================
   GET HR BY ID
========================= */
const getHrById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid HR ID",
      });
    }

    const hr = await Hr.findById(id);

    if (!hr) {
      return res.status(404).json({
        success: false,
        error: "HR not found",
      });
    }

    return res.json({
      success: true,
      data: hr,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

/* =========================
   CREATE HR
========================= */
const createHr = async (req, res) => {
  try {
    const { name, position } = req.body;
    const signature = req.files?.signature?.[0];

    if (!name || !position) {
      return res.status(400).json({
        success: false,
        error: "Name and position are required",
      });
    }

    if (!signature) {
      return res.status(400).json({
        success: false,
        error: "HR signature is required",
      });
    }

    

    const hr = await Hr.create({
      name,
      position,

      // SAVE S3 URL IN DB
      signaturePath: signature.location,   // full https URL
      signatureKey: signature.key,          // S3 object key (for deletion)

      isManual: true,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: hr,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "HR with the same name and position already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   PATCH HR
========================= */
const patchHr = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid HR ID",
      });
    }

    const hr = await Hr.findById(id);
    if (!hr) {
      return res.status(404).json({
        success: false,
        error: "HR not found",
      });
    }

    const { name, position } = req.body;
    const signature = req.files?.signature?.[0];

    let updated = false;

    if (name) {
      hr.name = name;
      updated = true;
    }

    if (position) {
      hr.position = position;
      updated = true;
    }

    if (signature) {
      // Delete old signature from S3
      if (hr.signatureKey) {
        await s3
          .deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: hr.signatureKey,
          })
          .promise();
      }

      // Save new S3 info
      hr.signaturePath = signature.location;
      hr.signatureKey = signature.key;
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({
        success: false,
        error: "No fields provided to update",
      });
    }

    await hr.save();

    return res.json({
      success: true,
      data: hr,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "HR with the same name and position already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   DELETE HR
========================= */
const deleteHr = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid HR ID",
      });
    }

    const hr = await Hr.findById(id);
    if (!hr) {
      return res.status(404).json({
        success: false,
        error: "HR not found",
      });
    }

    // Delete signature from S3
    if (hr.signatureKey) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: hr.signatureKey,
        })
        .promise();
    }

    await hr.deleteOne();

    return res.json({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

module.exports = {
  getHrList,
  getHrById,
  createHr,
  patchHr,
  deleteHr,
};
