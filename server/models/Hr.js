
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


    signaturePath: {
      type: String,
      required: true,
      trim: true,
    },


    signatureKey: {
      type: String,
      required: true,
      trim: true,
    },

    isManual: {
      type: Boolean,
      default: true, 
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


HrSchema.index({ name: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Hr", HrSchema);
