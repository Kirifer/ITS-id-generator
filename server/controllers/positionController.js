const Position = require("../models/Position");
const validator = require("validator");

const getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ isActive: true })
      .select("_id name")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (err) {
    console.error("Get Positions Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};

const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find()
      .select("_id name isActive")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (err) {
    console.error("Get All Positions Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all positions",
    });
  }
};

const createPosition = async (req, res) => {
  try {
    const { name } = req.body;
    const errors = {};

    if (!name || validator.isEmpty(name.trim())) {
      errors.name = "Position name is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const exists = await Position.findOne({ name });
    if (exists) {
      if (!exists.isActive) {
        exists.isActive = true;
        await exists.save();
        return res.status(200).json({
          success: true,
          message: "Position re-activated",
          data: exists,
        });
      }
      return res.status(409).json({
        success: false,
        message: "Position already exists",
      });
    }

    const position = await Position.create({ name });

    res.status(201).json({
      success: true,
      message: "Position created successfully",
      data: position,
    });
  } catch (err) {
    console.error("Create Position Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create position",
    });
  }
};

const patchPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const errors = {};

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid position ID",
      });
    }

    if (name !== undefined && validator.isEmpty(name.trim())) {
      errors.name = "Position name cannot be empty";
    }

    if (isActive !== undefined && !validator.isBoolean(String(isActive))) {
      errors.isActive = "isActive must be a boolean";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const position = await Position.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Position updated successfully",
      data: position,
    });
  } catch (err) {
    console.error("Patch Position Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update position",
    });
  }
};

const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid position ID",
      });
    }

    const position = await Position.findById(id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    if (!position.isActive) {
      return res.status(400).json({
        success: false,
        message: "Position is already inactive",
      });
    }

    position.isActive = false;
    await position.save();

    res.status(200).json({
      success: true,
      message: "Position deleted successfully",
    });
  } catch (err) {
    console.error("Delete Position Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete position",
    });
  }
};

module.exports = {
  getPositions,
  getAllPositions,
  createPosition,
  patchPosition,
  deletePosition,
};
