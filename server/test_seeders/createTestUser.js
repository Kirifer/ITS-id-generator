const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️ User already exists. Please delete it before running this script.');
      return process.exit(1);
    }

    const user = new User({
      username: 'approver2',
      password: 'approver123', 
      role: 'Approver',
      isActive: true
    });

    await user.save();
    console.log('✅ Test user created:', user.username);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error creating user:', err);
    process.exit(1);
  });
