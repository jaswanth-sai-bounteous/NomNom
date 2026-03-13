import { db } from "../db/db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAllCategories = async () => {
  const result = await db
    .select()
    .from(categories);

  return result;
};

export const getCategoryById = async (id: string) => {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  return result[0] || null;
};

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {

  const result = await db
    .insert(categories)
    .values({
      name: data.name,
      description: data.description
    })
    .returning();

  return result[0];
};