// server/controllers/idCardController.js

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mongoose = require("mongoose");
const crypto = require("crypto");
const AWS = require("aws-sdk");

const IdCard = require("../models/IdCard");
const Hr = require("../models/Hr");
const { fileCleaner } = require("../utils/fileCleaner");
const { processPhotoByType } = require("../utils/padding");

// 🔴 S3 client (for deletes + processing)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/* -------------------- helpers -------------------- */

const normalizePhone = (value) => {
  if (!value) return value;

  const phone = value.replace(/[^\d+]/g, "");

  if (phone.startsWith("+639")) return "0" + phone.slice(3);
  if (/^09\d{9}$/.test(phone)) return phone;

  throw new Error(
    "Invalid phone number format. Use 09XXXXXXXXX or +639XXXXXXXXX."
  );
};

// ⚠️ OLD LOCAL DELETE (KEPT FOR STRUCTURE – DISABLED)
const unlinkIfExists = (p) => {
  // Local uploads no longer used (S3 now)
  // if (p?.startsWith("/uploads/")) {
  //   fs.unlink(path.join(__dirname, "..", p.replace(/^\//, "")), () => {});
  // }
};

// Generate unique ID number (UNCHANGED)
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

// 🔴 Delete any file from S3 by key
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

/* -------------------- controllers -------------------- */

const getDetailIdCard = async (req, res) => {
  try {
    const item = await IdCard.findOne({
      employeeNumber: req.params.employeeNumber,
      status: "Approved",
    }).lean();

    if (!item)
      return res
        .status(404)
        .json({ message: "No approved ID with that employee number" });

    res.json({
      employeeNumber: item.employeeNumber,
      idNumber: item.idNumber,
      fullName: item.fullName,
      position: item.position,
      type: item.type,
      generatedFrontImagePath: item.generatedFrontImagePath,
      generatedBackImagePath: item.generatedBackImagePath,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const postIdCard = async (req, res) => {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      employeeNumber,
      position,
      type,
      email,
      phone,
      emFirstName,
      emMiddleInitial,
      emLastName,
      emPhone,
      hrId,
      hrName,
      hrPosition,
    } = req.body || {};

    const required = [
      ["firstName", firstName],
      ["lastName", lastName],
      ["employeeNumber", employeeNumber],
      ["position", position],
      ["type", type],
      ["email", email],
      ["phone", phone],
      ["emFirstName", emFirstName],
      ["emLastName", emLastName],
      ["emPhone", emPhone],
    ];

    for (const [k, v] of required)
      if (!v) return res.status(400).json({ message: `Missing field: ${k}` });

    if (await IdCard.exists({ employeeNumber }))
      return res
        .status(400)
        .json({ message: "Employee number already exists" });

    const phoneLocal = normalizePhone(phone);
    const emPhoneLocal = normalizePhone(emPhone);
    const idNumber = await generateUniqueIdNumber();

    const photo = req.files?.photo?.[0];
    const hrSignature = req.files?.hrSignature?.[0];

    if (!photo) return res.status(400).json({ message: "Photo is required" });

    let hrSnapshot;

    /* ============================
       HR FROM DATABASE
    ============================ */
    if (hrId) {
      const hr = await Hr.findById(hrId);
      if (!hr) {
        return res.status(400).json({ message: "Invalid HR selected" });
      }

      hrSnapshot = {
        hrRef: hr._id,
        name: hr.name,
        position: hr.position,
        signaturePath: hr.signaturePath,
        signatureKey: hr.signatureKey, // 🔴 KEEP KEY
      };
    }

    /* ============================
       MANUAL HR UPLOAD
    ============================ */
    else {
      if (!hrName || !hrPosition || !hrSignature) {
        return res.status(400).json({
          message: "HR name, position, and signature are required",
        });
      }

      hrSnapshot = {
        hrRef: null,
        name: hrName,
        position: hrPosition,

        // 🔴 DIRECT S3 SIGNATURE
        signaturePath: hrSignature.location,
        signatureKey: hrSignature.key,
      };
    }

    /* ============================
       PROCESS PHOTO (PADDING + S3 REUPLOAD)
    ============================ */
    const processed = await processPhotoByType(photo, type);

    /* ============================
       CREATE DOCUMENT
    ============================ */
    const doc = await IdCard.create({
      fullName: { firstName, middleInitial, lastName },
      employeeNumber,
      idNumber,
      position,
      type,
      contactDetails: { email, phone: phoneLocal },
      emergencyContact: {
        firstName: emFirstName,
        middleInitial: emMiddleInitial,
        lastName: emLastName,
        phone: emPhoneLocal,
      },
      hrDetails: hrSnapshot,

      // 🔴 PADDED PHOTO FROM S3
      photoPath: processed.location,
      photoKey: processed.key,

      status: "Approved",
      isGenerated: false,
      createdBy: req.user.id,
      approvedBy: req.user.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIdCard = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const items = await IdCard.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const patchIdCardApprove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updated = await IdCard.findByIdAndUpdate(
      id,
      { status: "Approved", approvedBy: req.user.id },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const patchIdCardReject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updated = await IdCard.findByIdAndUpdate(
      id,
      { status: "Rejected", approvedBy: req.user.id },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const patchIdCardDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const card = await IdCard.findById(id);
    if (!card) return res.status(404).json({ message: "Not found" });

    let updated = false;

    /* ============================
       SAVE OLD S3 KEYS
    ============================ */
    const oldFrontKey = card.generatedFrontKey;
    const oldBackKey = card.generatedBackKey;
    const oldPhotoKey = card.photoKey;
    const oldSignatureKey = card.hrDetails?.signatureKey;

    /* ============================
       TEXT UPDATES (UNCHANGED)
    ============================ */
    const updates = {
      "fullName.firstName": req.body.firstName,
      "fullName.middleInitial": req.body.middleInitial,
      "fullName.lastName": req.body.lastName,
      "contactDetails.email": req.body.email,
      position: req.body.position,
      "emergencyContact.firstName": req.body.emFirstName,
      "emergencyContact.middleInitial": req.body.emMiddleInitial,
      "emergencyContact.lastName": req.body.emLastName,
      "hrDetails.name": req.body.hrName,
      "hrDetails.position": req.body.hrPosition,
    };

    for (const [path, value] of Object.entries(updates)) {
      if (value !== undefined) {
        card.set(path, value);
        updated = true;
      }
    }

    if (req.body.phone !== undefined) {
      card.contactDetails.phone = normalizePhone(req.body.phone);
      updated = true;
    }

    if (req.body.emPhone !== undefined) {
      card.emergencyContact.phone = normalizePhone(req.body.emPhone);
      updated = true;
    }

    /* ============================
       NEW PHOTO (REPROCESS + DELETE OLD)
    ============================ */
    const photo = req.files?.photo?.[0];
    if (photo) {
      await deleteFromS3(oldPhotoKey);

      const processed = await processPhotoByType(photo, card.type);

      card.photoPath = processed.location;
      card.photoKey = processed.key;
      updated = true;
    }

    /* ============================
       NEW HR SIGNATURE
    ============================ */
    const hrSignature = req.files?.hrSignature?.[0];
    if (hrSignature) {
      await deleteFromS3(oldSignatureKey);

      card.hrDetails.signaturePath = hrSignature.location;
      card.hrDetails.signatureKey = hrSignature.key;
      updated = true;
    }

    /* ============================
       RESET GENERATED FILES IF UPDATED
    ============================ */
    if (updated) {
      await deleteFromS3(oldFrontKey);
      await deleteFromS3(oldBackKey);

      Object.assign(card, {
        generatedFrontImagePath: null,
        generatedBackImagePath: null,
        generatedFrontKey: null,
        generatedBackKey: null,
        isGenerated: false,
        status: card.status === "Rejected" ? "Rejected" : "Approved",
      });
    }

    await card.save();
    res.json(card);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

const deleteIdCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const doc = await IdCard.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    /* ============================
       DELETE ALL S3 FILES
    ============================ */
    await deleteFromS3(doc.photoKey);
    await deleteFromS3(doc.generatedFrontKey);
    await deleteFromS3(doc.generatedBackKey);
    await deleteFromS3(doc.hrDetails?.signatureKey);

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getDetailIdCard,
  postIdCard,
  getIdCard,
  patchIdCardApprove,
  patchIdCardReject,
  patchIdCardDetails,
  deleteIdCard,
};
