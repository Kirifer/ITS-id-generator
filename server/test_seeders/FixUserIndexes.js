const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop old unique index on email
    const indexes = await db.collection('users').indexes();
    const emailIndex = indexes.find(idx => idx.key.email === 1);
    if (emailIndex) {
      await db.collection('users').dropIndex(emailIndex.name);
      console.log('✅ Dropped old email index');
    } else {
      console.log('No old email index found');
    }

    // Remove old email field from all documents
    await db.collection('users').updateMany({}, { $unset: { email: "" } });
    console.log('✅ Removed email field from existing users');

    await mongoose.disconnect();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

fixIndexes();
