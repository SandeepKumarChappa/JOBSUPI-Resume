const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/openresume";
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "openresume",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Mongo connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;


