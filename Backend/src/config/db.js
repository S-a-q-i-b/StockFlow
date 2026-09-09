const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI?.trim();

    if (!uri) {
      throw new Error("MONGO_URI is missing.");
    }

    console.log("Mongo URI starts with:", uri.slice(0, 20));

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
