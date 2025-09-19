// testPassword.js
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("./models/User.js"); // adjust path if needed

dotenv.config();

const testPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = "approver1";
    const plainPassword = "approver123";

    // testHashPassword = await bcrypt.hash(plainPassword, 10);
    // console.log("Test hashed password for comparison:", testHashPassword);

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`❌ User ${username} not found`);
      return;
    }

    console.log("Full user document:", user); // <-- see all fields
    console.log("Stored password field:", user.password); // <-- see password

    if (!user.password) {
      console.log("⚠️ No password field stored for this user!");
      return;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    console.log(`Password match for ${username}:`, isMatch);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error testing password:", error);
  }
};

testPassword();

