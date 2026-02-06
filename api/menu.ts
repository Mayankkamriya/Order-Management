import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
}

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

const MenuItemModel = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);

const seedItems = [
  { name: "Classic Burger", description: "Juicy beef patty with fresh lettuce, tomato, and our special sauce on a toasted bun", price: 12.99, image: "/images/burger.png", category: "Burgers" },
  { name: "Margherita Pizza", description: "Traditional pizza with fresh mozzarella, basil, and San Marzano tomato sauce", price: 14.99, image: "/images/pizza.png", category: "Pizza" },
  { name: "Caesar Salad", description: "Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing", price: 9.99, image: "/images/salad.png", category: "Salads" },
  { name: "Crispy Fries", description: "Golden, crispy french fries seasoned with sea salt and herbs", price: 5.99, image: "/images/fries.png", category: "Sides" },
  { name: "Chicken Wings", description: "Tender wings tossed in your choice of buffalo, BBQ, or garlic parmesan sauce", price: 11.99, image: "/images/wings.png", category: "Sides" },
  { name: "Pasta Carbonara", description: "Creamy pasta with pancetta, egg, parmesan, and freshly cracked black pepper", price: 13.99, image: "/images/pasta.png", category: "Pasta" },
  { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream", price: 8.99, image: "/images/dessert.png", category: "Desserts" },
  { name: "Fresh Lemonade", description: "Freshly squeezed lemonade with a hint of mint and honey", price: 4.99, image: "/images/drink.png", category: "Drinks" },
];

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const count = await MenuItemModel.countDocuments();
    if (count === 0) {
      await MenuItemModel.insertMany(seedItems);
    }
    const items = await MenuItemModel.find().lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: String(error) });
  }
}
