import { MenuItemModel } from "./models";
import { log } from "./index";

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, San Marzano tomato sauce, and fragrant basil leaves on a crispy thin crust.",
    price: 1299,
    image: "/images/pizza.png",
    category: "Pizza",
  },
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, crisp lettuce, tomato, pickles, and special sauce on a toasted brioche bun.",
    price: 1099,
    image: "/images/burger.png",
    category: "Burgers",
  },
  {
    name: "Crispy French Fries",
    description: "Golden crispy fries seasoned with sea salt, served with house-made ketchup and garlic aioli dipping sauces.",
    price: 499,
    image: "/images/fries.png",
    category: "Sides",
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce tossed with creamy Caesar dressing, crunchy croutons, and shaved Parmesan cheese.",
    price: 899,
    image: "/images/salad.png",
    category: "Salads",
  },
  {
    name: "Buffalo Wings",
    description: "Tender chicken wings glazed in a tangy buffalo sauce, served with celery sticks and blue cheese dip.",
    price: 1149,
    image: "/images/wings.png",
    category: "Appetizers",
  },
  {
    name: "Fresh Lemonade",
    description: "Refreshing house-made lemonade with fresh lemons, a hint of mint, and served ice-cold.",
    price: 399,
    image: "/images/drink.png",
    category: "Drinks",
  },
  {
    name: "Pasta Carbonara",
    description: "Al dente spaghetti tossed with creamy egg sauce, crispy pancetta, and freshly cracked black pepper.",
    price: 1399,
    image: "/images/pasta.png",
    category: "Pasta",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm fudgy chocolate brownie topped with vanilla ice cream, chocolate drizzle, and crushed walnuts.",
    price: 699,
    image: "/images/dessert.png",
    category: "Desserts",
  },
];

export async function seedMenuItems() {
  try {
    const count = await MenuItemModel.countDocuments();
    if (count === 0) {
      await MenuItemModel.insertMany(menuItems);
      log(`Seeded ${menuItems.length} menu items`, "seed");
    } else {
      log(`Menu already has ${count} items, skipping seed`, "seed");
    }
  } catch (error) {
    log(`Error seeding menu items: ${error}`, "seed");
  }
}
