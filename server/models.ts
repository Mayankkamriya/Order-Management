import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const deliveryDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  deliveryDetails: { type: deliveryDetailsSchema, required: true },
  status: {
    type: String,
    enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
    default: "Order Received",
  },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MenuItemModel = mongoose.model("MenuItem", menuItemSchema);
export const OrderModel = mongoose.model("Order", orderSchema);
