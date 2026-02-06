import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../../server//db";
import { OrderModel } from "../../../server/models";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const { id } = req.query;
    const order = await OrderModel.findById(id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
}
