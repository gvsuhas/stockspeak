const mongoose = require('mongoose');

// Prevent Mongoose from buffering commands indefinitely when offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Force IPv4 to avoid Windows IPv6 resolution delay
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Atlas Connection Warning: ${error.message}`);
    return false;
  }
};

module.exports = { connectDB };
