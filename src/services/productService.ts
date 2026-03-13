import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { db } from "../db/db";
import { categories, foodCategories, foodItems } from "../db/schema";

type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
};

type DatabaseProduct = typeof foodItems.$inferSelect;

const attachCategoriesToProducts = async (products: DatabaseProduct[]) => {
  if (products.length === 0) {
    return [];
  }

  const productIds = products.map((product) => product.id);

  const categoryRows = await db
    .select({
      foodId: foodCategories.foodId,
      id: categories.id,
      name: categories.name,
      description: categories.description,
    })
    .from(foodCategories)
    .innerJoin(categories, eq(categories.id, foodCategories.categoryId))
    .where(inArray(foodCategories.foodId, productIds));

  return products.map((product) => ({
    ...product,
    categories: categoryRows
      .filter((category) => category.foodId === product.id)
      .map(({ foodId: _foodId, ...category }) => category),
  }));
};

const buildFilter = ({ search, categoryId }: ProductFilters) => {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(foodItems.title, `%${search}%`),
        ilike(foodItems.description, `%${search}%`),
      )!,
    );
  }

  if (categoryId) {
    conditions.push(eq(foodCategories.categoryId, categoryId));
  }

  if (conditions.length === 0) {
    return undefined;
  }

  return and(...conditions);
};

export const getProducts = async ({
  page = 1,
  limit = 9,
  search,
  categoryId,
}: ProductFilters) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 24));
  const filters = buildFilter({ search, categoryId });
  const offset = (safePage - 1) * safeLimit;

  const productRows = await db
    .select({
      id: foodItems.id,
      title: foodItems.title,
      description: foodItems.description,
      foodImg: foodItems.foodImg,
      price: foodItems.price,
      createdAt: foodItems.createdAt,
      updatedAt: foodItems.updatedAt,
    })
    .from(foodItems)
    .leftJoin(foodCategories, eq(foodCategories.foodId, foodItems.id))
    .where(filters)
    .groupBy(foodItems.id)
    .limit(safeLimit)
    .offset(offset);

  const totalRows = await db
    .select({
      count: sql<number>`count(distinct ${foodItems.id})`,
    })
    .from(foodItems)
    .leftJoin(foodCategories, eq(foodCategories.foodId, foodItems.id))
    .where(filters);

  const products = await attachCategoriesToProducts(productRows);
  const totalItems = Number(totalRows[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

  return {
    products,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
    },
  };
};

export const getAllProducts = async () => {
  return getProducts({ page: 1, limit: 100 });
};

export const getProductById = async (id: string) => {
  const products = await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.id, id))
    .limit(1);

  const [product] = await attachCategoriesToProducts(products);
  return product ?? null;
};

export const createProduct = async (data: {
  title: string;
  description?: string;
  foodImg?: string;
  price: number;
}) => {
  const newProduct = await db
    .insert(foodItems)
    .values({
      title: data.title,
      description: data.description,
      foodImg: data.foodImg,
      price: data.price.toString(),
    })
    .returning();

  return newProduct[0];
};

export const searchProducts = async (query: string) => {
  return getProducts({ page: 1, limit: 100, search: query });
};

export const getProductsByCategory = async (categoryId: string) => {
  return getProducts({ page: 1, limit: 100, categoryId });
};
