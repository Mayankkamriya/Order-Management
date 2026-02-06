import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../lib/db";
import { MenuItemModel } from "../../server/models";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const { id } = req.query;
    const item = await MenuItemModel.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu item" });
  }
}
