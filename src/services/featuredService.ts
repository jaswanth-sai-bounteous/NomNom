import { eq } from "drizzle-orm";

import { db } from "../db/db";
import { categories, featured, foodCategories, foodItems } from "../db/schema";

export const getFeaturedProducts = async () => {
  const products = await db
    .select({
      id: foodItems.id,
      title: foodItems.title,
      description: foodItems.description,
      foodImg: foodItems.foodImg,
      price: foodItems.price,
    })
    .from(featured)
    .innerJoin(foodItems, eq(featured.foodId, foodItems.id));

  const categoriesByFoodId = await db
    .select({
      foodId: foodCategories.foodId,
      id: categories.id,
      name: categories.name,
      description: categories.description,
    })
    .from(foodCategories)
    .innerJoin(categories, eq(categories.id, foodCategories.categoryId));

  return products.map((product) => ({
    ...product,
    categories: categoriesByFoodId
      .filter((category) => category.foodId === product.id)
      .map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })),
  }));
};

export const addFeaturedProduct = async (foodId: string) => {
  const result = await db
    .insert(featured)
    .values({
      foodId,
    })
    .returning();

  return result[0];
};
