const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createUser = async (username, password, role = 'Employee') => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('⚠️ User already exists:', username);
      await mongoose.disconnect();
      return;
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password,
      role,
      isActive: true
    });

    await newUser.save();
    console.log('✅ User created successfully:', {
      username,
      role
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating user:', err.message);
    mongoose.disconnect();
  }
};

// Allow running with arguments
if (require.main === module) {
  const username = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4] || 'Employee'; // default Employee

  if (!username || !password) {
    console.error('Usage: node createUser.js <username> <password> <role>');
    console.error('Example: node createUser.js admin1 admin123 Admin');
    console.error('Example: node createUser.js approver1 approver123 Approver');
    process.exit(1);
  }

  createUser(username, password, role);
}

module.exports = createUser;
