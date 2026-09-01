/**
 * Database Connection Configuration
 * Connects to MongoDB Atlas using Mongoose.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // If MONGO_URI is not provided, log a clear warning and skip connection
  // to avoid crashing the server during initial setup or offline development.
  if (!mongoURI || mongoURI.trim() === '') {
    console.warn('⚠️  [Database] MONGO_URI is not defined in environment variables. Database connection skipped.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [Database] MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
