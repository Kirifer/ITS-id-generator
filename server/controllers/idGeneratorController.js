// server/controllers/idGeneratorController.js
const IdCard = require('../models/IdCard');
const { generateIDImages } = require('../utils/generateImage');

/*
 HR reference:
 - Admin = Creator
 - Separate design for Employee / Intern
 - Template-based
 - Standalone
*/

const postIdGenerator = async (req, res) => {
  try {
    const card = await IdCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'ID Card not found' });
    }

    if (!card.photoPath) {
      return res.status(400).json({ message: 'Photo required before generation' });
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'ID generation failed',
    });
  }
};

module.exports = { postIdGenerator };
