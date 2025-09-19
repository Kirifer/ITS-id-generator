import Id from "../models/idModel.js";

export const createId = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      employeeNumber,
      emergencyContactName,
      emergencyContactNumber,
      clauses,
      signatoryName,
      signatoryPosition,
      companyAddress,
      barcode
    } = req.body;

    const photo = req.files?.photo ? req.files.photo[0].filename : null;
    const signatorySignature = req.files?.signatorySignature
      ? req.files.signatorySignature[0].filename
      : null;

    const newId = new Id({
      firstName,
      lastName,
      position,
      employeeNumber,
      photo,
      emergencyContactName,
      emergencyContactNumber,
      clauses,
      signatoryName,
      signatoryPosition,
      signatorySignature,
      companyAddress,
      barcode
    });

    await newId.save();
    res.status(201).json({ success: true, data: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
