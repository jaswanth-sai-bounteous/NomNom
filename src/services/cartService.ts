import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db/db";
import { cartItems, carts, categories, foodCategories, foodItems } from "../db/schema";

const attachProductsToCartItems = async (
  items: Array<typeof cartItems.$inferSelect>,
) => {
  if (items.length === 0) {
    return [];
  }

  const foodItemIds = items.map((item) => item.foodItemId);

  const products = await db
    .select()
    .from(foodItems)
    .where(inArray(foodItems.id, foodItemIds));

  const productCategories = await db
    .select({
      foodId: foodCategories.foodId,
      id: categories.id,
      name: categories.name,
      description: categories.description,
    })
    .from(foodCategories)
    .innerJoin(categories, eq(categories.id, foodCategories.categoryId))
    .where(inArray(foodCategories.foodId, foodItemIds));

  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.foodItemId);

    return {
      id: item.id,
      quantity: item.quantity,
      totalPrice: Number(item.totalPrice),
      product: product
        ? {
            id: product.id,
            title: product.title,
            description: product.description ?? undefined,
            foodImg: product.foodImg ?? undefined,
            price: Number(product.price),
            categories: productCategories
              .filter((category) => category.foodId === product.id)
              .map(({ foodId: _foodId, ...category }) => category),
          }
        : null,
    };
  });
};

/* Read only the authenticated user's cart and include product details. */
export const getCartByUserId = async (userId: string) => {
  const cartResult = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1)
    .execute();
  const cart = cartResult[0];

  if (!cart) return { cart: null, items: [] };

  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id))
    .execute();

  return {
    cart,
    items: (await attachProductsToCartItems(items)).filter((item) => item.product),
  };
};

/* Each user gets exactly one cart. If it does not exist yet, create it. */
const getOrCreateCartByUserId = async (userId: string) => {
  let cartResult = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1)
    .execute();
  let cart = cartResult[0];

  if (!cart) {
    const inserted = await db.insert(carts).values({ userId }).returning().execute();
    cart = inserted[0];
  }

  return cart;
};

export const addItemToCart = async (userId: string, foodItemId: string, quantity: number) => {
  const cart = await getOrCreateCartByUserId(userId);

  const foodResult = await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.id, foodItemId))
    .limit(1)
    .execute();
  const food = foodResult[0];
  if (!food) throw new Error("Food item not found");

  const existingResult = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.foodItemId, foodItemId)))
    .limit(1)
    .execute();
  const existingItem = existingResult[0];

  const price = Number(food.price);
  const totalPriceStr = (price * quantity).toString();

  if (existingItem) {
    const updatedQuantity = existingItem.quantity + quantity;
    const updatedTotalPrice = (price * updatedQuantity).toString();

    await db
      .update(cartItems)
      .set({ quantity: updatedQuantity, totalPrice: updatedTotalPrice })
      .where(eq(cartItems.id, existingItem.id))
      .execute();

    return getCartByUserId(userId);
  }

  await db
    .insert(cartItems)
    .values({
      cartId: cart.id,
      foodItemId,
      quantity,
      totalPrice: totalPriceStr,
    })
    .execute();

  return getCartByUserId(userId);
};

export const updateCartItem = async (userId: string, foodItemId: string, quantity: number) => {
  const cart = await getOrCreateCartByUserId(userId);

  const foodResult = await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.id, foodItemId))
    .limit(1)
    .execute();
  const food = foodResult[0];
  if (!food) throw new Error("Food item not found");

  const price = Number(food.price);

  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.foodItemId, foodItemId)))
      .execute();

    return getCartByUserId(userId);
  }

  await db
    .update(cartItems)
    .set({ quantity, totalPrice: (price * quantity).toString() })
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.foodItemId, foodItemId)))
    .execute();

  return getCartByUserId(userId);
};

export const removeCartItem = async (userId: string, foodItemId: string) => {
  const cart = await getOrCreateCartByUserId(userId);

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.foodItemId, foodItemId)))
    .execute();

  return getCartByUserId(userId);
};

export const clearCart = async (userId: string) => {
  const cart = await getOrCreateCartByUserId(userId);

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id)).execute();

  return getCartByUserId(userId);
};
