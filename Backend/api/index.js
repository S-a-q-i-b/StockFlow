require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbConnected = false;

module.exports = async (req, res) => {
  try {
    console.log("REQUEST:", req.method, req.url);
    console.log("ORIGIN:", req.headers.origin);

    if (!dbConnected) {
      console.log("Connecting to MongoDB...");
      await connectDB();
      dbConnected = true;
      console.log("MongoDB connected!");
    }

    return app(req, res);
  } catch (error) {
    console.error("VERCEL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
