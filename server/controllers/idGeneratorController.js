// server/controllers/idGeneratorController.js

const IdCard = require("../models/IdCard");
const { generateIDImages } = require("../utils/generateImage");

/*
 HR reference (FINAL):
 - HR details are MANUALLY INPUT per ID
 - Stored in IdCard.hrDetails
 - User credentials are NOT rendered
 - Approver is workflow-only
*/

const postIdGenerator = async (req, res) => {
  try {
    // 🔧 FIX: use cardId (Mongo ObjectId)
    const card = await IdCard.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({ message: "ID Card not found" });
    }

    if (card.status !== "Approved") {
      return res.status(400).json({
        message: "ID must be approved before generation",
      });
    }
    if (card.generatedFrontImagePath && card.generatedBackImagePath) {
      return res.status(400).json({ message: "ID already generated" });
    }

    if (!card.photoPath) {
      return res.status(400).json({
        message: "Photo required before generation",
      });
    }

    if (
      !card.hrDetails ||
      !card.hrDetails.name ||
      !card.hrDetails.position ||
      !card.hrDetails.signaturePath
    ) {
      return res.status(400).json({
        message: "HR details (name, position, signature) are required",
      });
    }

    // Convert to plain object
    const cardData = card.toObject();

    // Generate front & back images
    const { front, back } = await generateIDImages(cardData);

    card.generatedFrontImagePath = front;
    card.generatedBackImagePath = back;
    card.templateVersion = `${card.type}_V1`;
    card.issuedAt = new Date();
    await card.save();

    res.json({
      success: true,
      front,
      back,
    });
  } catch (err) {
    console.error("ID generation error:", err);
    res.status(500).json({
      success: false,
      message: "ID generation failed",
    });
  }
};

module.exports = { postIdGenerator };
