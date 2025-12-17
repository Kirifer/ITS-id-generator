const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mongoose = require("mongoose");
const IdCard = require("../models/IdCard");

/* =========================
   HELPERS
========================= */

/**
 * Generate UNIQUE idNumber
 * Format: ITS-XXXXXXXXXX (10 digits)
 */
const generateUniqueIdNumber = async () => {
  let idNumber;
  let exists = true;

  while (exists) {
    const digits = Date.now().toString().slice(-10);
    idNumber = `ITS-${digits}`;
    exists = await IdCard.exists({ idNumber });
  }

  return idNumber;
};

/* =========================
   Public lookup (Approved IDs only)
========================= */
const getDetailIdCard = async (req, res) => {
  try {
    const item = await IdCard.findOne({
      employeeNumber: req.params.employeeNumber,
      status: "Approved",
    }).lean();

    if (!item) {
      return res
        .status(404)
        .json({ message: "No approved ID with that employee number" });
    }

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

/* =========================
   Create ID (Admin only)
========================= */
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

      hrName,
      hrPosition,
    } = req.body || {};

    const required = {
      firstName,
      lastName,
      employeeNumber,
      position,
      type,
      email,
      phone,
      emFirstName,
      emLastName,
      emPhone,
      hrName,
      hrPosition,
    };

    for (const [k, v] of Object.entries(required)) {
      if (!v) {
        return res.status(400).json({ message: `Missing field: ${k}` });
      }
    }

    if (await IdCard.exists({ employeeNumber })) {
      return res.status(400).json({
        message: "Employee number already exists",
      });
    }

    const idNumber = await generateUniqueIdNumber();

    const photo = req.files?.photo?.[0];
    const hrSignature = req.files?.hrSignature?.[0];

    if (!photo || !hrSignature) {
      return res
        .status(400)
        .json({ message: "Photo and HR signature are required" });
    }

    try {
      await sharp(photo.path).metadata();
      await sharp(hrSignature.path).metadata();
    } catch {
      fs.unlink(photo.path, () => {});
      fs.unlink(hrSignature.path, () => {});
      return res.status(400).json({ message: "Invalid image file" });
    }

    const doc = await IdCard.create({
      fullName: { firstName, middleInitial, lastName },
      employeeNumber,
      idNumber,
      position,
      type,
      contactDetails: { email, phone },
      emergencyContact: {
        firstName: emFirstName,
        middleInitial: emMiddleInitial,
        lastName: emLastName,
        phone: emPhone,
      },
      hrDetails: {
        name: hrName,
        position: hrPosition,
        signaturePath: `/uploads/photos/${hrSignature.filename}`,
      },
      photoPath: `/uploads/photos/${photo.filename}`,
      status: "Pending",
      createdBy: req.user.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate ID detected. Please retry.",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   List IDs
========================= */
const getIdCard = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const items = await IdCard.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   Approve / Reject
========================= */
const patchIdCardApprove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await IdCard.findByIdAndUpdate(
      id,
      {
        status: "Approved",
        approvedBy: req.user.id,
        issuedAt: new Date(),
      },
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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

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

/* =========================
   PATCH ID DETAILS (✅ UPDATED)
========================= */
const patchIdCardDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const card = await IdCard.findById(id);
    if (!card) return res.status(404).json({ message: "Not found" });

    const photo = req.files?.photo?.[0];
    const hrSignature = req.files?.hrSignature?.[0];

    /* ===== UPDATE INTERN NAME ===== */
    if (req.body.firstName)
      card.fullName.firstName = req.body.firstName;

    if (req.body.middleInitial !== undefined)
      card.fullName.middleInitial = req.body.middleInitial;

    if (req.body.lastName)
      card.fullName.lastName = req.body.lastName;

     /* =========================
       EMERGENCY CONTACT
    ========================= */

    if (req.body.emFirstName)
      card.emergencyContact.firstName = req.body.emFirstName;

    if (req.body.emMiddleInitial !== undefined)
      card.emergencyContact.middleInitial = req.body.emMiddleInitial;

    if (req.body.emLastName)
      card.emergencyContact.lastName = req.body.emLastName;

    if (req.body.emPhone)
      card.emergencyContact.phone = req.body.emPhone;

    /* ===== UPDATE HR DETAILS ===== */
    if (req.body.hrName)
      card.hrDetails.name = req.body.hrName;

    if (req.body.hrPosition)
      card.hrDetails.position = req.body.hrPosition;

    /* ===== UPDATE FILES ===== */
    if (photo) {
      await sharp(photo.path).metadata();
      card.photoPath = `/uploads/photos/${photo.filename}`;
    }

    if (hrSignature) {
      await sharp(hrSignature.path).metadata();
      card.hrDetails.signaturePath =
        `/uploads/photos/${hrSignature.filename}`;
    }

    await card.save();
    res.json(card);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   Delete ID
========================= */
const deleteIdCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const doc = await IdCard.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const files = [];

    if (doc.photoPath)
      files.push(path.join(__dirname, "..", doc.photoPath.replace(/^\//, "")));

    if (doc.hrDetails?.signaturePath)
      files.push(
        path.join(__dirname, "..", doc.hrDetails.signaturePath.replace(/^\//, ""))
      );

    if (doc.generatedFrontImagePath)
      files.push(
        path.join(
          __dirname,
          "..",
          doc.generatedFrontImagePath.replace(/^\//, "")
        )
      );

    if (doc.generatedBackImagePath)
      files.push(
        path.join(
          __dirname,
          "..",
          doc.generatedBackImagePath.replace(/^\//, "")
        )
      );

    files.forEach((p) => fs.existsSync(p) && fs.unlink(p, () => {}));

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
