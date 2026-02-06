import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import { connectDB } from "./../server/db";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    res.json({ status: "ok", dbState: mongoose.connection.readyState });
  } catch (error) {
    res.status(500).json({ status: "error", message: String(error) });
  }
}
