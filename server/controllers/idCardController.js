// server/controllers/idCardController.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mongoose = require("mongoose");
const IdCard = require("../models/IdCard");

/* =========================
   Public lookup (Approved IDs only)
========================= */
const getDetailIdCard = async (req, res) => {
  try {
    const item = await IdCard.findOne({
      idNumber: req.params.idNumber,
      status: "Approved",
    }).lean();

    if (!item) {
      return res.status(404).json({ message: "No approved ID with that number" });
    }

    res.json({
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
      idNumber,
      position,
      type,
      email,
      phone,
      emFirstName,
      emMiddleInitial,
      emLastName,
      emPhone,
    } = req.body || {};

    // Required fields (HR document)
    const required = {
      firstName,
      lastName,
      employeeNumber,
      idNumber,
      position,
      type,
      email,
      phone,
      emFirstName,
      emLastName,
      emPhone,
    };

    for (const [k, v] of Object.entries(required)) {
      if (!v) {
        return res.status(400).json({ message: `Missing field: ${k}` });
      }
    }

    if (await IdCard.findOne({ idNumber })) {
      return res.status(400).json({ message: "ID number already exists" });
    }

    // Validate photo (HR/Admin upload only)
    if (req.file) {
      try {
        await sharp(req.file.path).metadata();
      } catch {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ message: "Invalid image file" });
      }
    }

    const photoPath = req.file
      ? `/uploads/photos/${req.file.filename}`
      : undefined;

    const doc = await IdCard.create({
      fullName: { firstName, middleInitial, lastName },
      employeeNumber,
      idNumber,
      position,
      type,
      contactDetails: {
        email,
        phone,
      },
      emergencyContact: {
        firstName: emFirstName,
        middleInitial: emMiddleInitial,
        lastName: emLastName,
        phone: emPhone,
      },
      photoPath,
      status: "Pending",
      createdBy: req.user.id, // ✅ FIXED
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   List IDs (Admin / Approver)
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
   Approve ID (Approver)
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
        approvedBy: req.user.id, // ✅ FIXED
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

/* =========================
   Reject ID (Approver)
========================= */
const patchIdCardReject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await IdCard.findByIdAndUpdate(
      id,
      {
        status: "Rejected",
        approvedBy: req.user.id, // ✅ FIXED
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   Update ID data (Admin)
========================= */
const patchIdCardDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await IdCard.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   Delete ID (Admin)
========================= */
const deleteIdCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const doc = await IdCard.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    // Cleanup files
    const files = [];
    if (doc.photoPath)
      files.push(path.join(__dirname, "..", doc.photoPath.replace(/^\//, "")));
    if (doc.generatedFrontImagePath)
      files.push(path.join(__dirname, "..", doc.generatedFrontImagePath.replace(/^\//, "")));
    if (doc.generatedBackImagePath)
      files.push(path.join(__dirname, "..", doc.generatedBackImagePath.replace(/^\//, "")));

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
