// server/models/IdCard.js
// CommonJS - Mongoose Model for e-Employee & Intern ID Generator

const mongoose = require('mongoose');

/* ===========================
   SUB-SCHEMAS
=========================== */

const FullNameSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleInitial: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const EmergencyContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleInitial: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const HrDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    signaturePath: {
      type: String, // uploaded image path
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* ===========================
   MAIN ID CARD SCHEMA
=========================== */

const IdCardSchema = new mongoose.Schema(
  {
    /* -------- Identity -------- */
    fullName: {
      type: FullNameSchema,
      required: true,
    },

    employeeNumber: {
      type: String,
      required: true,
      trim: true,
    },

    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['Employee', 'Intern'],
      required: true,
    },

    /* -------- Contact Details -------- */
    contactDetails: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    emergencyContact: {
      type: EmergencyContactSchema,
      required: true,
    },

    /* -------- HR / SIGNATORY (MANUAL INPUT) -------- */
    hrDetails: {
      type: HrDetailsSchema,
      required: true,
    },

    /* -------- Media -------- */
    photoPath: {
      type: String,
      trim: true, // Uploaded by HR only
    },

    generatedFrontImagePath: {
      type: String,
      trim: true,
    },

    generatedBackImagePath: {
      type: String,
      trim: true,
    },

    /* -------- QR / Barcode -------- */
    qrData: {
      type: String, // encoded payload
      trim: true,
    },

    barcodeData: {
      type: String, // encoded payload
      trim: true,
    },

    /* -------- Validity -------- */
    issuedAt: {
      type: Date,
    },

    validUntil: {
      type: Date,
    },

    /* -------- Template / Design -------- */
    templateVersion: {
      type: String, // e.g. EMP_V1, INTERN_V1
      trim: true,
    },

    /* -------- Workflow -------- */
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Creator (admin)
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Approver (workflow only)
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ===========================
   INDEXES
=========================== */

IdCardSchema.index({ idNumber: 1 }, { unique: true });
IdCardSchema.index({ employeeNumber: 1 });
IdCardSchema.index({ type: 1, status: 1 });

/* ===========================
   EXPORT
=========================== */

module.exports = mongoose.model('IdCard', IdCardSchema);
