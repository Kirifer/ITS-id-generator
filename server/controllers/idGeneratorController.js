// server/controllers/idGeneratorController.js

const IdCard = require("../models/IdCard");
const { generateIDImages } = require("../utils/generateImage");

const postIdGenerator = async (req, res) => {
  try {
    const card = await IdCard.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({ message: "ID Card not found" });
    }

    if (card.status !== "Approved") {
      return res.status(400).json({
        message: "ID must be approved before generation",
      });
    }
    if (card.isGenerated) {
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

    const cardData = card.toObject();

    if (!cardData.type || !["Employee", "Intern"].includes(cardData.type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing card type: ${cardData.type}`,
      });
    }

    const { front, back } = await generateIDImages(cardData);

    card.generatedFrontImagePath = front;
    card.generatedBackImagePath = back;
    card.templateVersion = `${card.type}_V1`;
    card.isGenerated = true;
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
      message: err.message || "ID generation failed",
    });
  }
};

module.exports = { postIdGenerator };
