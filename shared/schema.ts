import { z } from "zod";

export const menuItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  category: z.string(),
});

export const insertMenuItemSchema = menuItemSchema.omit({ _id: true });

export type MenuItem = z.infer<typeof menuItemSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export const cartItemSchema = z.object({
  menuItem: menuItemSchema,
  quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const orderStatusEnum = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

export const deliveryDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type DeliveryDetails = z.infer<typeof deliveryDetailsSchema>;

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  _id: z.string(),
  items: z.array(orderItemSchema),
  deliveryDetails: deliveryDetailsSchema,
  status: orderStatusEnum,
  total: z.number(),
  createdAt: z.string(),
});

export const insertOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  deliveryDetails: deliveryDetailsSchema,
  total: z.number().positive(),
});

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
