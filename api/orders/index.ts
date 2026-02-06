import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../server/db";
import { OrderModel } from "../../server/models";
import { insertOrderSchema } from "../../shared/schema";
import { z } from "zod";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const parsed = insertOrderSchema.parse(req.body);
      const newOrder = new OrderModel({
        items: parsed.items,
        deliveryDetails: parsed.deliveryDetails,
        total: parsed.total,
        status: "Order Received",
      });
      const order = await newOrder.save();
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
