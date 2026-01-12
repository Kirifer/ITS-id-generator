// server/controllers/hrController.js

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mongoose = require("mongoose");
const Hr = require("../models/Hr");

/* =========================
   GET ALL HR
========================= */
const getHrList = async (req, res) => {
  try {
    const hrs = await Hr.find().sort({ name: 1, position: 1 });
    res.json(hrs);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/* =========================
   GET HR BY ID
========================= */
const getHrById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid HR ID" });
    }

    const hr = await Hr.findById(id);

    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    res.json(hr);
  } catch (e) {
    return res.status(500).json({ message: e.message });
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
        message: "Name and position are required",
      });
    }

    if (!signature) {
      return res.status(400).json({
        message: "HR signature is required",
      });
    }

    try {
      await sharp(signature.path).metadata();
    } catch {
      fs.unlink(signature.path, () => {});
      return res.status(400).json({
        message: "Invalid signature image",
      });
    }

    const hr = await Hr.create({
      name,
      position,
      signaturePath: `/uploads/photos/${signature.filename}`,
      isManual: true,
      createdBy: req.user.id,
    });

    res.status(201).json(hr);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "HR with the same name and position already exists",
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   PATCH HR
========================= */
const patchHr = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid HR ID" });
    }

    const hr = await Hr.findById(id);
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
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
      try {
        await sharp(signature.path).metadata();
      } catch {
        fs.unlink(signature.path, () => {});
        return res.status(400).json({
          message: "Invalid signature image",
        });
      }

      // delete old signature
      if (hr.signaturePath) {
        const oldPath = path.join(
          __dirname,
          "..",
          hr.signaturePath.replace(/^\//, "")
        );
        fs.existsSync(oldPath) && fs.unlink(oldPath, () => {});
      }

      hr.signaturePath = `/uploads/photos/${signature.filename}`;
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    await hr.save();
    res.json(hr);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "HR with the same name and position already exists",
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE HR
========================= */
const deleteHr = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid HR ID" });
    }

    const hr = await Hr.findById(id);
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    if (hr.signaturePath) {
      const filePath = path.join(
        __dirname,
        "..",
        hr.signaturePath.replace(/^\//, "")
      );
      fs.existsSync(filePath) && fs.unlink(filePath, () => {});
    }

    await hr.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getHrList,
  getHrById,
  createHr,
  patchHr,   // ✅ THIS FIXES THE CRASH
  deleteHr,
};
