const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")

dotenv.config()

const seedUsers = async () => {
  try {
    console.log("Connecting to database...{0}", process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)

    const usersToSeed = [
      { username: "admin", password: "Admin@123", role: "Admin" },
    ]

    console.log("Connected. Seeding users...")
    for (const u of usersToSeed) {
      const existing = await User.findOne({ username: u.username })
      if (existing) {
        await User.deleteOne({ _id: existing._id })
      }

      const newUser = new User({
        username: u.username,
        password: u.password,
        role: u.role,
        isActive: true,
      })

      console.log(`- Seeding user: ${u.username} / ${u.password} (${u.role})`)
      await newUser.save()
      console.log("  → Saved.")
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedUsers()
