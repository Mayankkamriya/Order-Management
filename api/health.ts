import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    res.json({ status: "ok", dbState: mongoose.connection.readyState });
  } catch (error) {
    res.status(500).json({ status: "error", message: String(error) });
  }
}
