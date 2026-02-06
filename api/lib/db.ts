import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
  isConnected = true;
}
