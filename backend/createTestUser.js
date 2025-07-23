const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️ User already exists. Please delete it before running this script.');
      return process.exit(1);
    }

    const user = new User({
      email: 'test@example.com',
      password: '123456', // This will be hashed by the model
      role: 'Employee',
      isActive: true
    });

    await user.save();
    console.log('✅ Test user created:', user.email);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error creating user:', err);
    process.exit(1);
  });
