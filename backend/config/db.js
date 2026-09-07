/**
 * Database Connection Configuration
 * Connects to MongoDB Atlas using Mongoose.
 */

const mongoose = require('mongoose');
const dns = require('dns');
// Use public DNS resolvers (Google and Cloudflare) to ensure SRV lookups work reliably
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI?.trim();

  // Diagnostic output (SAFE – no secret data shown)
  const exists = !!rawUri;
  const startsCorrect = exists && /^(mongodb:\/\/|mongodb\+srv:\/\/)/i.test(rawUri);
  const length = exists ? rawUri.length : 0;
  const hasLeadingSpace = exists && /^\s/.test(rawUri);
  const hasTrailingSpace = exists && /\s$/.test(rawUri);
  console.log('🔍 [DB Diagnostic] MONGODB_URI exists:', exists);
  console.log('🔍 [DB Diagnostic] Starts with mongodb:// or mongodb+srv://:', startsCorrect);
  console.log('🔍 [DB Diagnostic] Length:', length);
  console.log('🔍 [DB Diagnostic] Leading whitespace:', hasLeadingSpace);
  console.log('🔍 [DB Diagnostic] Trailing whitespace:', hasTrailingSpace);

  // If the URI contains an unencoded '@' in the password (e.g., "@@"), encode it safely.
  // This protects against malformed URIs without exposing the actual credentials.
  // Robust encoding of password (handles @ symbols and other special characters)
  let mongoURI = null;
  if (rawUri) {
    // Find the last '@' which separates credentials from host
    const lastAt = rawUri.lastIndexOf('@');
    if (lastAt > -1) {
      const credentialsPart = rawUri.slice(0, lastAt); // includes protocol, username, password (possibly with @)
      const hostPart = rawUri.slice(lastAt + 1); // host and options

      // Split credentialsPart into protocol//username:password
      const protocolSplit = credentialsPart.split('://');
      if (protocolSplit.length === 2) {
        const protocol = protocolSplit[0] + '://';
        const userPass = protocolSplit[1]; // e.g., "sannidhi:Sannidhi@@2006"
        const colonIdx = userPass.indexOf(':');
        if (colonIdx > -1) {
          const username = userPass.slice(0, colonIdx);
          const passwordRaw = userPass.slice(colonIdx + 1);
          const encodedPass = encodeURIComponent(passwordRaw);
          mongoURI = `${protocol}${username}:${encodedPass}@${hostPart}`;
        } else {
          // No password, just username?
          mongoURI = rawUri;
        }
      } else {
        mongoURI = rawUri; // unexpected format, keep as is
      }
    } else {
      mongoURI = rawUri; // no @ found, keep as is
    }
  }

  // Ensure a database name is present (MongoDB may require one)
  if (mongoURI && mongoURI.includes('/?')) {
    mongoURI = mongoURI.replace('/?', '/test?'); // use a generic "test" db
  }

  // If the URI is missing or empty after processing, abort connection
  if (!mongoURI || mongoURI.trim() === '') {
    console.warn('⚠️  [Database] MONGODB_URI is not defined in environment variables. Database connection skipped.');
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
