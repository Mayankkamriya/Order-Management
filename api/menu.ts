import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./lib/db";
import { MenuItemModel } from "../server/models";
import { seedMenuItems } from "../server/seed";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    await seedMenuItems();
    const items = await MenuItemModel.find().lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: String(error) });
  }
}
