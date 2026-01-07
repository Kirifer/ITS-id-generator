const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// To run this seed simply run : npm run seed:accounts

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const usersToSeed = [
      { username: 'admin', password: 'Admin@123', role: 'Admin' },
      { username: 'approver1', password: 'Approver@123', role: 'Approver' },
    ];

    for (const u of usersToSeed) {
      const existing = await User.findOne({ username: u.username });
      if (existing) {
        console.log(`Deleting existing user: ${u.username}`);
        await User.deleteOne({ _id: existing._id });
      }

      const newUser = new User({
        username: u.username,
        password: u.password,
        role: u.role,
        isActive: true,
      });

      await newUser.save();
      console.log(`Created user: ${u.username} (${u.role})`);
    }

    console.log('✅ All users seeded successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();