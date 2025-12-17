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
      type: String,
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

    /**
     * Employee-facing ID
     * Displayed on FRONT
     * Example: ITS-00003
     * Provided by HR / Admin
     */
    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
    },

    /**
     * System-generated unique ID
     * Used for BARCODE (BACK)
     * Format: ITS-XXXXXXXXXX
     * Generated in controller ONLY
     */
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
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

    /* -------- HR / SIGNATORY -------- */

    hrDetails: {
      type: HrDetailsSchema,
      required: true,
    },

    /* -------- Media -------- */

    photoPath: {
      type: String,
      trim: true,
    },

    generatedFrontImagePath: {
      type: String,
      trim: true,
    },

    generatedBackImagePath: {
      type: String,
      trim: true,
    },

    /* -------- Validity -------- */

    issuedAt: {
      type: Date,
    },

    validUntil: {
      type: Date,
    },

    /* -------- Template -------- */

    templateVersion: {
      type: String,
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
      ref: 'User',
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   INDEXES (DATABASE GUARANTEE)
=========================== */

IdCardSchema.index({ employeeNumber: 1 }, { unique: true });
IdCardSchema.index({ idNumber: 1 }, { unique: true });
IdCardSchema.index({ type: 1, status: 1 });

/* ===========================
   EXPORT
=========================== */

module.exports = mongoose.model('IdCard', IdCardSchema);
