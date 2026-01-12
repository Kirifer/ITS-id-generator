const User = require("../models/User");
const validator = require("validator");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find()
      .select("-refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    console.error("Get All Admins Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id).select("-refreshToken");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    console.error("Get Admin By ID Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, password, role = "Admin", isActive = true } = req.body;
    console.log(isActive)
    const errors = {};

    if (!username || validator.isEmpty(username.trim())) {
      errors.username = "Username is required";
    } else if (!validator.isLength(username, { min: 3 })) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!password || validator.isEmpty(password)) {
      errors.password = "Password is required";
    } else if (!validator.isLength(password, { min: 8 })) {
      errors.password = "Password must be at least 8 characters";
    } else if (!validator.matches(password, /[A-Z]/)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!validator.matches(password, /[a-z]/)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!validator.matches(password, /\d/)) {
      errors.password = "Password must contain at least one number";
    } else if (!validator.matches(password, /[@$!%*?&#]/)) {
      errors.password = "Password must contain at least one special character";
    }

    if (role !== "Admin") {
      errors.role = "Only Admin role is allowed";
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

    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const admin = new User({
      username,
      password,
      role: "Admin",
      isActive: isActive === undefined ? true : isActive,
    });

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminResponse,
    });
  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, isActive } = req.body;

    const errors = {};

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID format",
      });
    }

    const admin = await User.findById(id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (username !== undefined) {
      if (validator.isEmpty(username.trim())) {
        errors.username = "Username cannot be empty";
      } else if (!validator.isLength(username, { min: 3 })) {
        errors.username = "Username must be at least 3 characters";
      } else if (username !== admin.username) {
        const existingAdmin = await User.findOne({ username });
        if (existingAdmin) {
          errors.username = "Username already exists";
        }
      }
    }

    if (password !== undefined) {
      if (validator.isEmpty(password)) {
        errors.password = "Password cannot be empty";
      } else if (!validator.isLength(password, { min: 8 })) {
        errors.password = "Password must be at least 8 characters";
      } else if (!validator.matches(password, /[A-Z]/)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!validator.matches(password, /[a-z]/)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!validator.matches(password, /\d/)) {
        errors.password = "Password must contain at least one number";
      } else if (!validator.matches(password, /[@$!%*?&#]/)) {
        errors.password =
          "Password must contain at least one special character";
      }
    }

    if (role !== undefined && role !== "Admin") {
      errors.role = "Only Admin role is allowed";
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

    if (username !== undefined) admin.username = username;
    if (password !== undefined) admin.password = password;
    admin.role = "Admin";
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.refreshToken;

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: adminResponse,
    });
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update admin",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.error("Delete Admin Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};

const filterAdmins = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    const filter = { role: "Admin" };

    if (search) {
      filter.username = {
        $regex: validator.escape(search),
        $options: "i",
      };
    }

    if (isActive !== undefined) {
      if (!validator.isBoolean(String(isActive))) {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean",
        });
      }
      filter.isActive = isActive === "true";
    }

    const admins = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    console.error("Filter Admins Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to filter admins",
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  filterAdmins,
};
