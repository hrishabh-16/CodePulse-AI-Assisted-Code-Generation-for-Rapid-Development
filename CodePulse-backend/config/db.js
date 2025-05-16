const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// Suppress the strictQuery deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // Remove the deprecated options:
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;