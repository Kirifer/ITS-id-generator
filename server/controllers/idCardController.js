const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mongoose = require("mongoose");
const IdCard = require("../models/IdCard");
const { generateIDImage } = require("../utils/generateImage");

const getDetailIdCard = async (req, res) => {
  try {
    const item = await IdCard.findOne({
      idNumber: req.params.idNumber,
      status: "Approved",
    }).lean();

    if (!item)
      return res
        .status(404)
        .json({ message: "No approved ID with that number" });

    // Return only what's safe/needed publicly
    res.json({
      idNumber: item.idNumber,
      fullName: item.fullName,
      position: item.position,
      type: item.type,
      generatedImagePath: item.generatedImagePath,
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
      idNumber,
      position,
      type,
      emFirstName,
      emMiddleInitial,
      emLastName,
      emPhone,
    } = req.body || {};

    // Required fields
    const required = {
      firstName,
      lastName,
      idNumber,
      position,
      type,
      emFirstName,
      emLastName,
      emPhone,
    };
    for (const [k, v] of Object.entries(required)) {
      if (!v) return res.status(400).json({ message: `Missing field: ${k}` });
    }

    if (await IdCard.findOne({ idNumber })) {
      return res.status(400).json({ message: "ID number already exists." });
    }

    // Validate the uploaded file is an image
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
      idNumber,
      position,
      type,
      emergencyContact: {
        firstName: emFirstName,
        middleInitial: emMiddleInitial,
        lastName: emLastName,
        phone: emPhone,
      },
      photoPath,
      status: "Pending",
    });

    // Generate composite (auto template by type)
    try {
      const generated = await generateIDImage(doc.toObject());
      if (generated) {
        if (gen?.front) doc.generatedFrontImagePath = gen.front;
        if (gen?.back) doc.generatedFrontImagePath = gen.back;
        await doc.save();
      }
    } catch (e) {
      console.warn("Composite generation failed:", e.message);
    }

    res.status(201).json(doc);
  } catch (err) {
    const msg = /Invalid file type/i.test(err.message)
      ? "Invalid file type. Only JPEG and PNG are allowed."
      : err.message;
    res.status(500).json({ message: msg });
  }
};

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

const patchIdCardApprove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updated = await IdCard.findByIdAndUpdate(
      id,
      { status: "Approved" },
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
      { status: "Rejected" },
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

    const b = req.body || {};
    const payload = {
      "fullName.firstName": b?.fullName?.firstName,
      "fullName.middleInitial": b?.fullName?.middleInitial,
      "fullName.lastName": b?.fullName?.lastName,
      idNumber: b?.idNumber,
      position: b?.position,
      type: b?.type,
      "emergencyContact.firstName": b?.emergencyContact?.firstName,
      "emergencyContact.middleInitial": b?.emergencyContact?.middleInitial,
      "emergencyContact.lastName": b?.emergencyContact?.lastName,
      "emergencyContact.phone": b?.emergencyContact?.phone,
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );

    let updated = await IdCard.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });

    // Regenerate composite whenever data changes
    try {
      const out = await generateIDImage(updated.toObject());
      if (out) {
        if (gen?.front) updated.generatedFrontImagePath = gen.front;
        if (gen?.back) updated.generatedFrontImagePath = gen.back;
        await updated.save();
      }
    } catch (e) {
      console.warn("Regenerate failed:", e.message);
    }

    res.json(updated);
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

    // Best-effort cleanup
    const toDelete = [];
    if (doc.photoPath)
      toDelete.push(
        path.join(__dirname, "..", doc.photoPath.replace(/^\//, ""))
      );
    if (doc.generatedImagePath)
      toDelete.push(
        path.join(__dirname, "..", doc.generatedImagePath.replace(/^\//, ""))
      );
    toDelete.forEach((p) => fs.existsSync(p) && fs.unlink(p, () => {}));

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  getDetailIdCard,
  postIdCard,
  getIdCard,
  patchIdCardApprove,
  patchIdCardReject,
  patchIdCardDetails,
  deleteIdCard
};
