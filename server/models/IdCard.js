// server/models/IdCard.js

const mongoose = require("mongoose");

const FullNameSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleInitial: {
      type: String,
      default: "",
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
      default: "",
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
      validate: {
        validator: (v) => /^(09\d{9}|\+639\d{9})$/.test(v),
        message:
          "Invalid phone number format. Use 09XXXXXXXXX or +639XXXXXXXXX",
      },
    },
  },
  { _id: false }
);

/**
 * HR snapshot + optional reference
 * - hrRef exists ONLY when HR is selected from DB
 * - Manual HR uses snapshot fields only
 */
const HrSnapshotSchema = new mongoose.Schema(
  {
    hrRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hr",
      required: false, // ✅ FIX: allow manual HR
    },
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

// ===========================
// VALIDATORS
// ===========================

const employeeNumberValidator = {
  validator: function (value) {
    if (this.type === "Employee") {
      return /^ITS-\d{5}$/.test(value);
    }
    if (this.type === "Intern") {
      return /^ITSIN-\d{5}$/.test(value);
    }
    return false;
  },
  message:
    "Employee number must be ITS-XXXXX (Employee) or ITSIN-XXXXX (Intern)",
};

const phoneValidator = {
  validator: (v) => /^(09\d{9}|\+639\d{9})$/.test(v),
  message: "Invalid phone number format. Use 09XXXXXXXXX or +639XXXXXXXXX",
};

const IdCardSchema = new mongoose.Schema(
  {
    fullName: {
      type: FullNameSchema,
      required: true,
    },

    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: employeeNumberValidator,
    },

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
      enum: ["Employee", "Intern"],
      required: true,
    },

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
        validate: phoneValidator,
      },
    },

    emergencyContact: {
      type: EmergencyContactSchema,
      required: true,
    },

    hrDetails: {
      type: HrSnapshotSchema,
      required: true,
    },

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

    issuedAt: {
      type: Date,
    },

    validUntil: {
      type: Date,
    },

    templateVersion: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   INDEXES (DATABASE GUARANTEE)
=========================== */

// Avoid duplicate index warnings (already handled by schema)
IdCardSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model("IdCard", IdCardSchema);
