import mongoose from "mongoose";
import { log } from "./index";
import "dotenv/config";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    await mongoose.connect(uri);
    log("Connected to MongoDB", "mongodb");
  } catch (error) {
    log(`MongoDB connection error: ${error}`, "mongodb");
    throw error;
  }
}
