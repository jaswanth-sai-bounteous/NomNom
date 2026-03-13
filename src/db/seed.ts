import { db } from "../db/db";
import { categories, foodItems, foodCategories } from "./schema";

const foodData = [
  {
    title: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: "149",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?garlic-bread"
  },
  {
    title: "Cheese Garlic Bread",
    description: "Garlic bread topped with melted mozzarella",
    price: "179",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?cheese-garlic-bread"
  },
  {
    title: "French Fries",
    description: "Crispy golden potato fries",
    price: "129",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?french-fries"
  },
  {
    title: "Loaded Fries",
    description: "Fries topped with cheese sauce and jalapenos",
    price: "199",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?loaded-fries"
  },
  {
    title: "Onion Rings",
    description: "Crispy battered onion rings",
    price: "169",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?onion-rings"
  },
  {
    title: "Mozzarella Sticks",
    description: "Breaded mozzarella served with marinara",
    price: "219",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?mozzarella-sticks"
  },
  {
    title: "Chicken Wings",
    description: "Spicy fried chicken wings",
    price: "259",
    category: "starters",
    foodImg: "https://source.unsplash.com/featured/?chicken-wings"
  },

  {
    title: "Classic Veg Burger",
    description: "Veg patty with lettuce tomato and mayo",
    price: "199",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?veg-burger"
  },
  {
    title: "Paneer Tikka Burger",
    description: "Paneer tikka patty with spicy sauce",
    price: "229",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?paneer-burger"
  },
  {
    title: "Crispy Chicken Burger",
    description: "Fried chicken fillet burger",
    price: "249",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?chicken-burger"
  },
  {
    title: "Double Cheese Burger",
    description: "Double patty loaded with cheese",
    price: "279",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?cheese-burger"
  },
  {
    title: "BBQ Chicken Burger",
    description: "Chicken burger with smoky BBQ sauce",
    price: "299",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?bbq-burger"
  },
  {
    title: "Mushroom Swiss Burger",
    description: "Veg patty topped with mushrooms",
    price: "249",
    category: "burgers",
    foodImg: "https://source.unsplash.com/featured/?mushroom-burger"
  },

  {
    title: "Margherita Pizza",
    description: "Classic tomato mozzarella pizza",
    price: "299",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?margherita-pizza"
  },
  {
    title: "Farmhouse Pizza",
    description: "Loaded with veggies and mozzarella",
    price: "349",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?veg-pizza"
  },
  {
    title: "Veggie Supreme Pizza",
    description: "Peppers olives onions mushrooms",
    price: "369",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?veggie-pizza"
  },
  {
    title: "Pepperoni Pizza",
    description: "Classic pepperoni mozzarella pizza",
    price: "399",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?pepperoni-pizza"
  },
  {
    title: "BBQ Chicken Pizza",
    description: "Chicken pizza with BBQ sauce",
    price: "429",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?bbq-chicken-pizza"
  },
  {
    title: "Paneer Tikka Pizza",
    description: "Indian style paneer tikka pizza",
    price: "379",
    category: "pizza",
    foodImg: "https://source.unsplash.com/featured/?paneer-pizza"
  },

  {
    title: "Alfredo Pasta",
    description: "Creamy white sauce pasta",
    price: "289",
    category: "pasta",
    foodImg: "https://source.unsplash.com/featured/?alfredo-pasta"
  },
  {
    title: "Arrabbiata Pasta",
    description: "Spicy tomato sauce pasta",
    price: "269",
    category: "pasta",
    foodImg: "https://source.unsplash.com/featured/?arrabbiata-pasta"
  },
  {
    title: "Pesto Pasta",
    description: "Basil pesto pasta",
    price: "309",
    category: "pasta",
    foodImg: "https://source.unsplash.com/featured/?pesto-pasta"
  },
  {
    title: "Mushroom Cream Pasta",
    description: "Cream pasta with mushrooms",
    price: "299",
    category: "pasta",
    foodImg: "https://source.unsplash.com/featured/?mushroom-pasta"
  },
  {
    title: "Chicken Alfredo Pasta",
    description: "Alfredo pasta with grilled chicken",
    price: "339",
    category: "pasta",
    foodImg: "https://source.unsplash.com/featured/?chicken-alfredo"
  },

  {
    title: "Veg Fried Rice",
    description: "Stir fried rice with vegetables",
    price: "199",
    category: "rice_bowls",
    foodImg: "https://source.unsplash.com/featured/?veg-fried-rice"
  },
  {
    title: "Chicken Fried Rice",
    description: "Classic chicken fried rice",
    price: "229",
    category: "rice_bowls",
    foodImg: "https://source.unsplash.com/featured/?chicken-fried-rice"
  },
  {
    title: "Paneer Rice Bowl",
    description: "Rice with paneer gravy",
    price: "249",
    category: "rice_bowls",
    foodImg: "https://source.unsplash.com/featured/?paneer-rice"
  },
  {
    title: "Teriyaki Chicken Bowl",
    description: "Rice bowl with teriyaki chicken",
    price: "279",
    category: "rice_bowls",
    foodImg: "https://source.unsplash.com/featured/?teriyaki-chicken-bowl"
  },
  {
    title: "Korean Spicy Chicken Bowl",
    description: "Rice bowl with spicy Korean chicken",
    price: "289",
    category: "rice_bowls",
    foodImg: "https://source.unsplash.com/featured/?korean-chicken-bowl"
  },

  {
    title: "Chocolate Lava Cake",
    description: "Warm cake with molten chocolate center",
    price: "199",
    category: "desserts",
    foodImg: "https://source.unsplash.com/featured/?lava-cake"
  },
  {
    title: "Brownie with Ice Cream",
    description: "Chocolate brownie with vanilla ice cream",
    price: "219",
    category: "desserts",
    foodImg: "https://source.unsplash.com/featured/?brownie-icecream"
  },
  {
    title: "New York Cheesecake",
    description: "Creamy baked cheesecake",
    price: "249",
    category: "desserts",
    foodImg: "https://source.unsplash.com/featured/?cheesecake"
  },
  {
    title: "Tiramisu",
    description: "Italian coffee dessert",
    price: "259",
    category: "desserts",
    foodImg: "https://source.unsplash.com/featured/?tiramisu"
  },
  {
    title: "Chocolate Mousse",
    description: "Rich chocolate mousse dessert",
    price: "199",
    category: "desserts",
    foodImg: "https://source.unsplash.com/featured/?chocolate-mousse"
  },

  {
    title: "Coca Cola",
    description: "Chilled classic coke",
    price: "90",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?cola"
  },
  {
    title: "Fresh Lime Soda",
    description: "Refreshing lime soda",
    price: "110",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?lime-soda"
  },
  {
    title: "Iced Tea",
    description: "Cold brewed lemon iced tea",
    price: "120",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?iced-tea"
  },
  {
    title: "Cold Coffee",
    description: "Blended cold coffee with ice cream",
    price: "150",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?cold-coffee"
  },
  {
    title: "Mango Smoothie",
    description: "Fresh mango smoothie",
    price: "160",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?mango-smoothie"
  },
  {
    title: "Strawberry Milkshake",
    description: "Creamy strawberry milkshake",
    price: "170",
    category: "drinks",
    foodImg: "https://source.unsplash.com/featured/?strawberry-milkshake"
  }
];

async function seed() {
  console.log("🌱 Seeding started...");

  const uniqueCategories = [...new Set(foodData.map((f) => f.category))];

  const insertedCategories = await db
    .insert(categories)
    .values(uniqueCategories.map((name) => ({ name })))
    .returning();

  const categoryMap: Record<string, string> = {};

  insertedCategories.forEach((c) => {
    categoryMap[c.name] = c.id;
  });

  for (const food of foodData) {
    const insertedFood = await db
      .insert(foodItems)
      .values({
        title: food.title,
        description: food.description,
        price: food.price,
        foodImg: food.foodImg
      })
      .returning();

    await db.insert(foodCategories).values({
      foodId: insertedFood[0].id,
      categoryId: categoryMap[food.category]
    });
  }

  console.log("✅ Seeding completed!");
}

seed();