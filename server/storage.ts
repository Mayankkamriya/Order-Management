import { MenuItemModel, OrderModel } from "./models";
import type { InsertMenuItem, InsertOrder, OrderStatus } from "@shared/schema";

export interface IStorage {
  getMenuItems(): Promise<any[]>;
  getMenuItem(id: string): Promise<any | null>;
  createMenuItem(item: InsertMenuItem): Promise<any>;
  getOrder(id: string): Promise<any | null>;
  createOrder(order: InsertOrder): Promise<any>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<any | null>;
  getAllOrders(): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  async getMenuItems() {
    return MenuItemModel.find().lean();
  }

  async getMenuItem(id: string) {
    return MenuItemModel.findById(id).lean();
  }

  async createMenuItem(item: InsertMenuItem) {
    const menuItem = new MenuItemModel(item);
    return menuItem.save();
  }

  async getOrder(id: string) {
    return OrderModel.findById(id).lean();
  }

  async createOrder(order: InsertOrder) {
    const newOrder = new OrderModel({
      items: order.items,
      deliveryDetails: order.deliveryDetails,
      total: order.total,
      status: "Order Received",
    });
    return newOrder.save();
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }

  async getAllOrders() {
    return OrderModel.find().sort({ createdAt: -1 }).lean();
  }
}

export const storage = new MongoStorage();
