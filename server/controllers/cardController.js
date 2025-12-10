// server/controllers/cardController.js
const Card = require('../models/Card');
const mongoose = require('mongoose');
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

// Get a single card by id_no
exports.getCardByIdNo = async (req, res) => {
  try {
    const { id_no } = req.params;

    const card = await Card.findOne({ id_no });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving card', error: error.message });
  }
};

// UPDATE card
exports.updateCard = async (req, res) => {
  const { id_no } = req.params;
  const updateData = req.body;

  try {
    const updatedCard = await Card.findOneAndUpdate(
      { id_no: id_no },     
      updateData,
      { new: true }      
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found for id_no: ' + id_no });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating card: ' + error.message });
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