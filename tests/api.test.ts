import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { MenuItemModel, OrderModel } from "../server/models";

const MONGODB_URI = process.env.MONGODB_URI || "";

describe("API Models and CRUD Operations", () => {
  beforeAll(async () => {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not set");
    }
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("MenuItem CRUD", () => {
    let createdItemId: string;

    it("should create a menu item", async () => {
      const item = new MenuItemModel({
        name: "Test Pizza",
        description: "A test pizza for TDD",
        price: 9.99,
        image: "/images/pizza.png",
        category: "Pizza",
      });
      const saved = await item.save();
      createdItemId = saved._id.toString();
      expect(saved.name).toBe("Test Pizza");
      expect(saved.price).toBe(9.99);
      expect(saved.category).toBe("Pizza");
    });

    it("should read all menu items", async () => {
      const items = await MenuItemModel.find().lean();
      expect(items.length).toBeGreaterThan(0);
    });

    it("should read a single menu item by ID", async () => {
      const item = await MenuItemModel.findById(createdItemId).lean();
      expect(item).toBeDefined();
      expect(item!.name).toBe("Test Pizza");
    });

    it("should update a menu item", async () => {
      const updated = await MenuItemModel.findByIdAndUpdate(
        createdItemId,
        { price: 11.99 },
        { new: true }
      ).lean();
      expect(updated!.price).toBe(11.99);
    });

    it("should delete a menu item", async () => {
      await MenuItemModel.findByIdAndDelete(createdItemId);
      const item = await MenuItemModel.findById(createdItemId).lean();
      expect(item).toBeNull();
    });
  });

  describe("Order CRUD", () => {
    let createdOrderId: string;

    it("should create an order", async () => {
      const order = new OrderModel({
        items: [
          {
            menuItemId: "test123",
            name: "Test Burger",
            price: 10.99,
            quantity: 2,
          },
        ],
        deliveryDetails: {
          name: "John Doe",
          address: "123 Test Street",
          phone: "1234567890",
        },
        total: 21.98,
        status: "Order Received",
      });
      const saved = await order.save();
      createdOrderId = saved._id.toString();
      expect(saved.status).toBe("Order Received");
      expect(saved.total).toBe(21.98);
      expect(saved.items.length).toBe(1);
    });

    it("should read an order by ID", async () => {
      const order = await OrderModel.findById(createdOrderId).lean();
      expect(order).toBeDefined();
      expect(order!.deliveryDetails.name).toBe("John Doe");
    });

    it("should update order status", async () => {
      const updated = await OrderModel.findByIdAndUpdate(
        createdOrderId,
        { status: "Preparing" },
        { new: true }
      ).lean();
      expect(updated!.status).toBe("Preparing");
    });

    it("should update order status to Out for Delivery", async () => {
      const updated = await OrderModel.findByIdAndUpdate(
        createdOrderId,
        { status: "Out for Delivery" },
        { new: true }
      ).lean();
      expect(updated!.status).toBe("Out for Delivery");
    });

    it("should update order status to Delivered", async () => {
      const updated = await OrderModel.findByIdAndUpdate(
        createdOrderId,
        { status: "Delivered" },
        { new: true }
      ).lean();
      expect(updated!.status).toBe("Delivered");
    });

    it("should delete the test order", async () => {
      await OrderModel.findByIdAndDelete(createdOrderId);
      const order = await OrderModel.findById(createdOrderId).lean();
      expect(order).toBeNull();
    });
  });

  describe("Input Validation", () => {
    it("should reject order with empty items array", async () => {
      const { insertOrderSchema } = await import("../shared/schema");
      const result = insertOrderSchema.safeParse({
        items: [],
        deliveryDetails: {
          name: "Test",
          address: "123 Test St",
          phone: "1234567890",
        },
        total: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject order with missing delivery name", async () => {
      const { insertOrderSchema } = await import("../shared/schema");
      const result = insertOrderSchema.safeParse({
        items: [
          { menuItemId: "1", name: "Burger", price: 10.99, quantity: 1 },
        ],
        deliveryDetails: {
          name: "",
          address: "123 Test St",
          phone: "1234567890",
        },
        total: 10.99,
      });
      expect(result.success).toBe(false);
    });

    it("should reject order with short phone number", async () => {
      const { insertOrderSchema } = await import("../shared/schema");
      const result = insertOrderSchema.safeParse({
        items: [
          { menuItemId: "1", name: "Burger", price: 10.99, quantity: 1 },
        ],
        deliveryDetails: {
          name: "John",
          address: "123 Test St",
          phone: "123",
        },
        total: 10.99,
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid order data", async () => {
      const { insertOrderSchema } = await import("../shared/schema");
      const result = insertOrderSchema.safeParse({
        items: [
          { menuItemId: "1", name: "Burger", price: 10.99, quantity: 2 },
        ],
        deliveryDetails: {
          name: "Jane Doe",
          address: "456 Real Street",
          phone: "5551234567",
        },
        total: 21.98,
      });
      expect(result.success).toBe(true);
    });

    it("should validate order status enum", async () => {
      const { orderStatusEnum } = await import("../shared/schema");
      expect(orderStatusEnum.safeParse("Order Received").success).toBe(true);
      expect(orderStatusEnum.safeParse("Preparing").success).toBe(true);
      expect(orderStatusEnum.safeParse("Out for Delivery").success).toBe(true);
      expect(orderStatusEnum.safeParse("Delivered").success).toBe(true);
      expect(orderStatusEnum.safeParse("Invalid Status").success).toBe(false);
    });
  });
});
