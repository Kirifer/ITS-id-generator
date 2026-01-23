const mongoose = require("mongoose");
const IdCard = require("../models/IdCard");
const Hr = require("../models/Hr");
const { processPhotoByType } = require("../utils/padding");
const {
  normalizePhone,
  generateUniqueIdNumber,
  deleteFromS3,
} = require("../service/helper");


// ================= GET DETAIL =================
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


// ================= CREATE =================
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

    // normalize + enforce prefix by type
    const digits = employeeNumber.replace(/\D/g, "").slice(0, 10);

    let finalEmployeeNumber;
    if (type === "Intern") {
      finalEmployeeNumber = `ITSIN-${digits}`;
    } else {
      finalEmployeeNumber = `ITS-${digits}`;
    }

    if (await IdCard.exists({ employeeNumber: finalEmployeeNumber }))
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
        signatureKey: hr.signatureKey,
      };
    } else {
      if (!hrName || !hrPosition || !hrSignature) {
        return res.status(400).json({
          message: "HR name, position, and signature are required",
        });
      }

      hrSnapshot = {
        hrRef: null,
        name: hrName,
        position: hrPosition,
        signaturePath: hrSignature.location,
        signatureKey: hrSignature.key,
      };
    }

    const processed = await processPhotoByType(photo, type);

    const doc = await IdCard.create({
      fullName: { firstName, middleInitial, lastName },
      employeeNumber: finalEmployeeNumber,
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


// ================= LIST =================
const getIdCard = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const items = await IdCard.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// ================= APPROVE / REJECT =================
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


// ================= UPDATE DETAILS =================
const patchIdCardDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const card = await IdCard.findById(id);
    if (!card) return res.status(404).json({ message: "Not found" });

    let updated = false;

    const oldFrontKey = card.generatedFrontKey;
    const oldBackKey = card.generatedBackKey;
    const oldPhotoKey = card.photoKey;
    const oldSignatureKey = card.hrDetails?.signatureKey;

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

    // 🔥 TYPE + EMPLOYEE NUMBER HANDLING
    const newType = req.body.type;
    const newEmployeeNumber = req.body.employeeNumber;

    if (newType || newEmployeeNumber) {
      const typeToUse = newType || card.type;
      const numberToUse = newEmployeeNumber || card.employeeNumber;

      const digits = numberToUse.replace(/\D/g, "").slice(0, 10);

      if (typeToUse === "Intern") {
        card.employeeNumber = `ITSIN-${digits}`;
      } else {
        card.employeeNumber = `ITS-${digits}`;
      }

      card.type = typeToUse;

      // prevent duplicate on update
      const exists = await IdCard.exists({
        _id: { $ne: card._id },
        employeeNumber: card.employeeNumber,
      });

      if (exists) {
        return res.status(400).json({
          message: "Employee number already exists",
        });
      }

      updated = true;
    }

    // photo update
    const photo = req.files?.photo?.[0];
    if (photo) {
      await deleteFromS3(oldPhotoKey);
      const processed = await processPhotoByType(photo, card.type);
      card.photoPath = processed.location;
      card.photoKey = processed.key;
      updated = true;
    }

    // hr signature update
    const hrSignature = req.files?.hrSignature?.[0];
    if (hrSignature) {
      await deleteFromS3(oldSignatureKey);
      card.hrDetails.signaturePath = hrSignature.location;
      card.hrDetails.signatureKey = hrSignature.key;
      updated = true;
    }

    // reset generation if anything changed
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


// ================= DELETE =================
const deleteIdCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const doc = await IdCard.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

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
