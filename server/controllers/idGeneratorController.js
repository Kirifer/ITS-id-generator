// server/controllers/idGeneratorController.js
const IdCard = require('../models/IdCard');
const { generateIDImages } = require('../utils/generateImage');

/*
 HR reference:
 - Admin = Creator
 - Approver = HR Signatory (Back of ID)
 - Separate design for Employee / Intern
 - Template-based
 - Standalone
*/

const postIdGenerator = async (req, res) => {
  try {
    // 🔑 POPULATE APPROVER DATA
    const card = await IdCard.findById(req.params.id)
      .populate('approvedBy', 'firstName lastName position role');

    if (!card) {
      return res.status(404).json({ message: 'ID Card not found' });
    }

    if (card.status !== 'Approved') {
      return res.status(400).json({
        message: 'ID must be approved before generation',
      });
    }

    if (!card.photoPath) {
      return res.status(400).json({
        message: 'Photo required before generation',
      });
    }

    // Generate front & back using templates
    const { front, back } = await generateIDImages(card.toObject());

    card.generatedFrontImagePath = front;
    card.generatedBackImagePath = back;
    card.templateVersion = `${card.type}_V1`;

    await card.save();

    res.json({
      success: true,
      front,
      back,
      approver: card.approvedBy, // 👈 for debugging/confirmation
    });
  } catch (err) {
    console.error('ID generation error:', err);
    res.status(500).json({
      success: false,
      message: 'ID generation failed',
    });
  }
};

module.exports = { postIdGenerator };
