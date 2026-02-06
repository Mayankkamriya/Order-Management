import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/db";
import { OrderModel } from "../../../server/models";
import { z } from "zod";

const orderStatusEnum = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { id } = req.query;
    const { status } = z.object({ status: orderStatusEnum }).parse(req.body);
    const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid status", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update order status" });
  }
}
