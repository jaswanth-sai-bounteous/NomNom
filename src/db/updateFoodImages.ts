// src/db/updateFoodImages.ts
import { db } from "../db/db";
import { foodItems } from "./schema";
import { eq } from "drizzle-orm";

const foodImages: { title: string; url: string }[] = [
  { title: "Garlic Bread", url: "https://source.unsplash.com/featured/?garlic-bread" },
  { title: "Cheese Garlic Bread", url: "https://source.unsplash.com/featured/?cheese-garlic-bread" },
  { title: "French Fries", url: "https://source.unsplash.com/featured/?french-fries" },
  { title: "Loaded Fries", url: "https://source.unsplash.com/featured/?loaded-fries" },
  { title: "Onion Rings", url: "https://source.unsplash.com/featured/?onion-rings" },
  { title: "Mozzarella Sticks", url: "https://source.unsplash.com/featured/?mozzarella-sticks" },
  { title: "Chicken Wings", url: "https://source.unsplash.com/featured/?chicken-wings" },

  { title: "Classic Veg Burger", url: "https://source.unsplash.com/featured/?veg-burger" },
  { title: "Paneer Tikka Burger", url: "https://source.unsplash.com/featured/?paneer-burger" },
  { title: "Crispy Chicken Burger", url: "https://source.unsplash.com/featured/?chicken-burger" },
  { title: "Double Cheese Burger", url: "https://source.unsplash.com/featured/?cheese-burger" },
  { title: "BBQ Chicken Burger", url: "https://source.unsplash.com/featured/?bbq-burger" },
  { title: "Mushroom Swiss Burger", url: "https://source.unsplash.com/featured/?mushroom-burger" },

  { title: "Margherita Pizza", url: "https://source.unsplash.com/featured/?margherita-pizza" },
  { title: "Farmhouse Pizza", url: "https://source.unsplash.com/featured/?veg-pizza" },
  { title: "Veggie Supreme Pizza", url: "https://source.unsplash.com/featured/?veggie-pizza" },
  { title: "Pepperoni Pizza", url: "https://source.unsplash.com/featured/?pepperoni-pizza" },
  { title: "BBQ Chicken Pizza", url: "https://source.unsplash.com/featured/?bbq-chicken-pizza" },
  { title: "Paneer Tikka Pizza", url: "https://source.unsplash.com/featured/?paneer-pizza" },

  { title: "Alfredo Pasta", url: "https://source.unsplash.com/featured/?alfredo-pasta" },
  { title: "Arrabbiata Pasta", url: "https://source.unsplash.com/featured/?arrabbiata-pasta" },
  { title: "Pesto Pasta", url: "https://source.unsplash.com/featured/?pesto-pasta" },
  { title: "Mushroom Cream Pasta", url: "https://source.unsplash.com/featured/?mushroom-pasta" },
  { title: "Chicken Alfredo Pasta", url: "https://source.unsplash.com/featured/?chicken-alfredo" },

  { title: "Veg Fried Rice", url: "https://source.unsplash.com/featured/?veg-fried-rice" },
  { title: "Chicken Fried Rice", url: "https://source.unsplash.com/featured/?chicken-fried-rice" },
  { title: "Paneer Rice Bowl", url: "https://source.unsplash.com/featured/?paneer-rice" },
  { title: "Teriyaki Chicken Bowl", url: "https://source.unsplash.com/featured/?teriyaki-chicken-bowl" },
  { title: "Korean Spicy Chicken Bowl", url: "https://source.unsplash.com/featured/?korean-chicken-bowl" },

  { title: "Chocolate Lava Cake", url: "https://source.unsplash.com/featured/?lava-cake" },
  { title: "Brownie with Ice Cream", url: "https://source.unsplash.com/featured/?brownie-icecream" },
  { title: "New York Cheesecake", url: "https://source.unsplash.com/featured/?cheesecake" },
  { title: "Tiramisu", url: "https://source.unsplash.com/featured/?tiramisu" },
  { title: "Chocolate Mousse", url: "https://source.unsplash.com/featured/?chocolate-mousse" },

  { title: "Coca Cola", url: "https://source.unsplash.com/featured/?cola" },
  { title: "Fresh Lime Soda", url: "https://source.unsplash.com/featured/?lime-soda" },
  { title: "Iced Tea", url: "https://source.unsplash.com/featured/?iced-tea" },
  { title: "Cold Coffee", url: "https://source.unsplash.com/featured/?cold-coffee" },
  { title: "Mango Smoothie", url: "https://source.unsplash.com/featured/?mango-smoothie" },
  { title: "Strawberry Milkshake", url: "https://source.unsplash.com/featured/?strawberry-milkshake" }
];

async function updateFoodImages() {
  console.log("🌱 Updating food images...");

  for (const food of foodImages) {
    await db
      .update(foodItems)
      .set({ foodImg: food.url })
      .where(eq(foodItems.title, food.title));
  }

  console.log("✅ All food images updated to Unsplash!");
}

updateFoodImages();