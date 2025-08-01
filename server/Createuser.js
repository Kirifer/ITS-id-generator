const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createUser = async (email, password, role = 'Employee') => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    await newUser.save();
    console.log('✅ User created successfully:', {
      email,
      role
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating user:', err.message);
    mongoose.disconnect();
  }
};

// Example usage:
// For creating a student user
// createUser('user@example.com', 'studentpassword', 'student');

// For creating an admin user
// createUser('admin@example.com', 'adminpassword', 'admin');

// If no arguments provided, create a default user

// Example usage:
if (require.main === module) {
  // Change this to the account you want to add:
  createUser('cdlamadrid.web@gmail.com', 'test1234', 'Admin');
}

module.exports = createUser;
