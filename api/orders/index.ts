import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import { z } from "zod";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
}

const orderItemMongoSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const deliveryDetailsMongoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderMongoSchema = new mongoose.Schema({
  items: { type: [orderItemMongoSchema], required: true },
  deliveryDetails: { type: deliveryDetailsMongoSchema, required: true },
  status: {
    type: String,
    enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
    default: "Order Received",
  },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderMongoSchema);

const deliveryDetailsSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(10),
});

const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
});

const insertOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  deliveryDetails: deliveryDetailsSchema,
  total: z.number().positive(),
});

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
