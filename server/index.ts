import express from "express";
import mongoose from "mongoose";
import { storage } from "../server/storage";
import { insertOrderSchema } from "../shared/schema";
import { z } from "zod";

const app = express();
app.use(express.json());

const orderStatusEnum = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

let dbConnected = false;

async function ensureDB() {
  if (dbConnected && mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
  dbConnected = true;
}

app.use(async (_req, _res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/menu", async (_req, res) => {
  try {
    const items = await storage.getMenuItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

app.get("/api/menu/:id", async (req, res) => {
  try {
    const item = await storage.getMenuItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu item" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const parsed = insertOrderSchema.parse(req.body);
    const order = await storage.createOrder(parsed);
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = z.object({ status: orderStatusEnum }).parse(req.body);
    const order = await storage.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid status", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update order status" });
  }
});

app.get("/api/orders", async (_req, res) => {
  try {
    const orders = await storage.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default app;
