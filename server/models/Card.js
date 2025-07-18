const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id_no: { type: String, required: true, unique: true },
  grade: String,
  dob: String,
  address: String,
  email: String,
  exp_date: String,
  phone: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
