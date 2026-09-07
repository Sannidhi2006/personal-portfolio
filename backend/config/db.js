/**
 * Database Connection Configuration
 * Connects to MongoDB Atlas using Mongoose with fast timeout and resilience.
 */

const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setDefaultResultOrder?.('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS config errors if running in restricted environments
}

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI?.trim();

  if (!rawUri) {
    console.warn('⚠️  [Database] MONGODB_URI is not defined in environment variables. Running in offline/memory mode.');
    return null;
  }

  // Safe URI parsing if password contains special characters
  let mongoURI = rawUri;
  const lastAt = rawUri.lastIndexOf('@');
  if (lastAt > -1) {
    const credentialsPart = rawUri.slice(0, lastAt);
    const hostPart = rawUri.slice(lastAt + 1);
    const protocolSplit = credentialsPart.split('://');
    if (protocolSplit.length === 2) {
      const protocol = protocolSplit[0] + '://';
      const userPass = protocolSplit[1];
      const colonIdx = userPass.indexOf(':');
      if (colonIdx > -1) {
        const username = userPass.slice(0, colonIdx);
        const passwordRaw = userPass.slice(colonIdx + 1);
        mongoURI = `${protocol}${username}:${encodeURIComponent(passwordRaw)}@${hostPart}`;
      }
    }
  }

  if (mongoURI && mongoURI.includes('/?')) {
    mongoURI = mongoURI.replace('/?', '/portfolio?');
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ [Database] MongoDB Connection notice: ${error.message}. Running with in-memory persistence.`);
    return null;
  }
};

module.exports = connectDB;
