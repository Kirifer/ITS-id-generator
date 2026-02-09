const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

if (!process.env.RUN_SEED) {
  console.log("Seeder skipped. Set RUN_SEED=true to run.");
  process.exit(0);
}

const seedUsers = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const existing = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) {
      console.log(`User "${process.env.ADMIN_USERNAME}" already exists. Skipping.`);
    } else {
      const newUser = new User({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: "Admin",
        isActive: true,
      });
      await newUser.save();
      console.log(`User "${process.env.ADMIN_USERNAME}" created.`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error("Seeder error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();
