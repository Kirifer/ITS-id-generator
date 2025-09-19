// models/idModel.js
import mongoose from "mongoose";

const idSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  position: String,
  employeeNumber: String,
  photo: String,

  // Rear view fields
  emergencyContactName: String,
  emergencyContactNumber: String,

  clauses: {
    type: String,
    default: "This ID is non-transferrable and shall be confiscated when used by others.\n\nWear this ID when entering company premises and present to company officers upon demand."
  },

  signatoryName: String,
  signatoryPosition: String,
  signatorySignature: String, // could be image file

  companyAddress: String,
  barcode: String, // could store barcode value, and generate image in frontend

  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Id", idSchema);
