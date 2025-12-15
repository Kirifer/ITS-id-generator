const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const login = async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username }).select(
      "+password +role +isActive +refreshToken"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account inactive" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m", algorithm: "HS256" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    );

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        user: { id: user._id, username: user.username, role: user.role },
      });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const refresher = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token)
      return res.status(401).json({ error: "No refresh token found." });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ error: "Invalid or expire refresh token." });
    }

    const user = await User.findById(payload.id).select("+refreshToken");

    if (!user || !user.refreshToken) {
      return res.status(403).json({ error: "Refresh token not found in DB." });
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);

    if (!isValid) {
      return res.status(403).json({ error: "Invalid refresh token." });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const checkAuth = async(req,res) => {
  try{
    const user = await User.findById(req.user.id).select('id role');

    if(!user) {
      return res.status(401).json({error: "You are not authenticated."})
    }

    return res.status(200).json({success: true, role: user.role, id: user.id})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: "Something went wrong."})
  }
}

module.exports = { login, refresher, checkAuth };
