// server/models/Hr.js

const mongoose = require("mongoose");

const HrSchema = new mongoose.Schema(
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

    // Full S3 URL (used by frontend & ID generation)
    signaturePath: {
      type: String,
      required: true,
      trim: true,
    },

    // S3 object key (used only for deleting from S3)
    signatureKey: {
      type: String,
      required: true,
      trim: true,
    },

    isManual: {
      type: Boolean,
      default: true, // manually added HR
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent duplicate HR entries
 */
HrSchema.index({ name: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Hr", HrSchema);
