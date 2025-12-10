// server/models/IdCard.js (CommonJS)

const mongoose = require('mongoose');

const FullNameSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleInitial: { type: String, default: '' },
    lastName: { type: String, required: true },
  },
  { _id: false }
);

const EmergencyContactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleInitial: { type: String, default: '' },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const IdCardSchema = new mongoose.Schema(
  {
    fullName: { type: FullNameSchema, required: true },
    idNumber: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    type: { type: String, enum: ['Employee', 'Intern'], required: true },
    emergencyContact: { type: EmergencyContactSchema, required: true },

    // Photo uploaded by Admin HR
    photoPath: { type: String }, // e.g. /uploads/photos/169999-foo.jpg

    // Generated composite image (optional)
    generatedFrontImagePath: { type: String },
    generatedBackImagePath:  { type: String },


    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Explicit index (in addition to unique on the path)
IdCardSchema.index({ idNumber: 1 }, { unique: true });

module.exports = mongoose.model('IdCard', IdCardSchema);
