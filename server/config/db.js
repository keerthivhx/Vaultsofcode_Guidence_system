const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not set. Operating with resilient local JSON store.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error (${error.message}). Falling back to local JSON store.`);
    return false;
  }
};

module.exports = connectDB;
