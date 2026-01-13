const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mongoose = require("mongoose");
const IdCard = require("../models/IdCard");
const Hr = require("../models/Hr");
const { fileCleaner } = require("../utils/fileCleaner");

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

const unlinkIfExists = (p) => {
  if (p?.startsWith("/uploads/")) {
    fs.unlink(path.join(__dirname, "..", p.replace(/^\//, "")), () => {});
  }
};

const generateUniqueIdNumber = async () => {
  let idNumber,
    exists = true;

  while (exists) {
    idNumber = `ITS-${Date.now().toString().slice(-10)}`;
    exists = await IdCard.exists({ idNumber });
  }

  return idNumber;
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
    await sharp(photo.path).metadata();

    let hr;

    if (hrId) {
      hr = await Hr.findById(hrId);
      if (!hr) return res.status(400).json({ message: "Invalid HR selected" });
    } else {
      if (!hrName || !hrPosition || !hrSignature)
        return res.status(400).json({
          message: "HR name, position, and signature are required",
        });

      await sharp(hrSignature.path).metadata();

      hr = await Hr.create({
        name: hrName,
        position: hrPosition,
        signaturePath: `/uploads/photos/${hrSignature.filename}`,
        isManual: true,
        createdBy: req.user.id,
      });
    }

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
      hrDetails: {
        hrRef: hr._id,
        name: hr.name,
        position: hr.position,
        signaturePath: hr.signaturePath,
      },
      photoPath: `/uploads/photos/${photo.filename}`,
      status: "Approved",
      isGenerated: false,
      createdBy: req.user.id,
      approvedBy: req.user.id,
      // issuedAt: new Date(),
    });

    res.status(201).json(doc);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.fromEntries(
          Object.entries(err.errors).map(([k, v]) => [k, v.message])
        ),
      });
    }

    if (err.code === 11000)
      return res
        .status(409)
        .json({ message: "Duplicate ID detected. Please retry." });

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
      { status: "Approved", 
        approvedBy: req.user.id, 
        // issuedAt: new Date() 
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

    if ("employeeNumber" in req.body)
      return res
        .status(400)
        .json({ message: "Employee number cannot be modified" });

    const card = await IdCard.findById(id);
    if (!card) return res.status(404).json({ message: "Not found" });

    const oldFront = card.generatedFrontImagePath;
    const oldBack = card.generatedBackImagePath;
    const oldPhoto = card.photoPath;
    const oldSignature = card.hrDetails?.signaturePath;

    let updated = false;

    const updates = {
      "fullName.firstName": req.body.firstName,
      "fullName.middleInitial": req.body.middleInitial,
      "fullName.lastName": req.body.lastName,
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

    if (req.body.emPhone !== undefined) {
      card.emergencyContact.phone = normalizePhone(req.body.emPhone);
      updated = true;
    }

    const photo = req.files?.photo?.[0];
    if (photo) {
      await sharp(photo.path).metadata();
      card.photoPath = `/uploads/photos/${photo.filename}`;
      unlinkIfExists(oldPhoto);
      updated = true;
    }

    const hrSignature = req.files?.hrSignature?.[0];
    if (hrSignature) {
      await sharp(hrSignature.path).metadata();
      card.hrDetails.signaturePath = `/uploads/photos/${hrSignature.filename}`;
      unlinkIfExists(oldSignature);
      updated = true;
    }

    if (updated) {
      Object.assign(card, {
        generatedFrontImagePath: null,
        generatedBackImagePath: null,
        isGenerated: false,
        status: card.status === "Rejected" ? "Rejected" : "Approved",
      });
      fileCleaner(oldFront);
      fileCleaner(oldBack);
    }

    await card.save();
    res.json(card);
  } catch (e) {
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

    [
      doc.photoPath,
      doc.hrDetails?.signaturePath,
      doc.generatedFrontImagePath,
      doc.generatedBackImagePath,
    ].forEach(unlinkIfExists);

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