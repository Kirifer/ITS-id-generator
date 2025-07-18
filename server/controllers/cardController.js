// server/controllers/cardController.js
const Card = require('../models/Card');
const path = require('path');
const fs = require('fs');

// GET all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards); // send data to React frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cards: ' + err.message });
  }
};

// CREATE a card
exports.createCard = async (req, res) => {
  try {
    const { name, id_no, grade, dob, address, email, exp_date, phone } = req.body;

    const existing = await Card.findOne({ id_no });
    if (existing) {
      return res.status(400).json({ message: 'Card already exists.' });
    }

    let imagePath = '';
    if (req.file) {
      // Save the relative path to access it via /uploads/
      imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    }

    const card = new Card({ name, id_no, grade, dob, address, email, exp_date, phone, image: imagePath });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Error creating card: ' + err.message });
  }
};

// UPDATE card
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, id_no } = req.body;

    const card = await Card.findByIdAndUpdate(id, { name, id_no }, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Error updating card: ' + err.message });
  }
};

// DELETE card
exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting card: ' + err.message });
  }
};