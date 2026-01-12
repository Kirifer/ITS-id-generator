const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")

dotenv.config()

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const usersToSeed = [
      { username: "admin", password: "Admin@123", role: "Admin" },
    ]

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

      await newUser.save()
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedUsers()
