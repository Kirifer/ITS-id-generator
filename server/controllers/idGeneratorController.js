const IdCard = require("../models/IdCard");
const Hr = require("../models/Hr");
const { generateIDImages } = require("../utils/generateImage");

const postIdGenerator = async (req, res) => {
  try {
    const card = await IdCard.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "ID Card not found",
      });
    }

    if (card.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "ID must be approved before generation",
      });
    }

    if (card.isGenerated) {
      return res.status(400).json({
        success: false,
        message: "ID already generated",
      });
    }

    if (!card.photoPath || !card.photoKey) {
      return res.status(400).json({
        success: false,
        message: "Photo is required before generation",
      });
    }

    // 🔑 validate HR using signatureKey, NOT signaturePath
    if (
      !card.hrDetails ||
      !card.hrDetails.name ||
      !card.hrDetails.position ||
      !card.hrDetails.signatureKey
    ) {
      return res.status(400).json({
        success: false,
        message: "HR details are required before generation",
      });
    }

    if (!["Employee", "Intern"].includes(card.type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid card type: ${card.type}`,
      });
    }

    const cardData = card.toObject();

    // ─────────────────────────────────────────────
    // CASE 1: HR selected from HR Management
    // → Always pull latest HR signature
    // ─────────────────────────────────────────────
    if (card.hrDetails.hrRef) {
      const hr = await Hr.findById(card.hrDetails.hrRef);

      if (!hr || !hr.signatureKey) {
        return res.status(400).json({
          success: false,
          message: "Selected HR no longer has a valid signature",
        });
      }

      // normalize HR data for generator
      cardData.hrDetails = {
        hrRef: hr._id,
        name: hr.name,
        position: hr.position,
        signatureKey: hr.signatureKey,
        signaturePath: hr.signaturePath || null,
      };

      // sync snapshot back to card
      card.hrDetails.name = hr.name;
      card.hrDetails.position = hr.position;
      card.hrDetails.signatureKey = hr.signatureKey;
      card.hrDetails.signaturePath = hr.signaturePath || null;
    }

    // ─────────────────────────────────────────────
    // CASE 2: Manual HR upload
    // → Use stored snapshot ONLY
    // ─────────────────────────────────────────────
    if (!card.hrDetails.hrRef) {
      cardData.hrDetails = {
        name: card.hrDetails.name,
        position: card.hrDetails.position,
        signatureKey: card.hrDetails.signatureKey,
        signaturePath: card.hrDetails.signaturePath || null,
      };
    }

    // ─────────────────────────────────────────────
    // Generate ID images (S3 KEYS ONLY)
    // ─────────────────────────────────────────────
    const { frontUrl, frontKey, backUrl, backKey } =
      await generateIDImages(cardData);

    card.generatedFrontImagePath = frontUrl;
    card.generatedFrontKey = frontKey;
    card.generatedBackImagePath = backUrl;
    card.generatedBackKey = backKey;

    card.templateVersion = `${card.type}_V1`;
    card.isGenerated = true;
    card.issuedAt = new Date();

    await card.save();

    return res.json({
      success: true,
      front: frontUrl,
      back: backUrl,
    });
  } catch (err) {
    console.error("ID generation error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "ID generation failed",
    });
  }
};

module.exports = { postIdGenerator };
