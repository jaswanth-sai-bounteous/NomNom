import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db/db";
import {
  carts,
  cartItems,
  categories,
  foodCategories,
  foodItems,
  orderItems,
  orders,
  payments,
} from "../db/schema";

type OrderRow = typeof orders.$inferSelect;

const attachItemsToOrders = async (orderRows: OrderRow[]) => {
  if (orderRows.length === 0) {
    return [];
  }

  const orderIds = orderRows.map((order) => order.id);

  const rawItems = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      foodItemId: orderItems.foodItemId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      totalPrice: orderItems.totalPrice,
      productId: foodItems.id,
      title: foodItems.title,
      description: foodItems.description,
      foodImg: foodItems.foodImg,
      createdAt: foodItems.createdAt,
      updatedAt: foodItems.updatedAt,
    })
    .from(orderItems)
    .innerJoin(foodItems, eq(orderItems.foodItemId, foodItems.id))
    .where(inArray(orderItems.orderId, orderIds));

  const productIds = rawItems.map((item) => item.productId);
  const rawCategories =
    productIds.length === 0
      ? []
      : await db
          .select({
            foodId: foodCategories.foodId,
            id: categories.id,
            name: categories.name,
            description: categories.description,
          })
          .from(foodCategories)
          .innerJoin(categories, eq(categories.id, foodCategories.categoryId))
          .where(inArray(foodCategories.foodId, productIds));

  return orderRows.map((order) => ({
    ...order,
    status: "confirmed" as const,
    items: rawItems
      .filter((item) => item.orderId === order.id)
      .map((item) => ({
        id: item.id,
        orderId: item.orderId,
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: Number(item.price),
        totalPrice: Number(item.totalPrice),
        product: {
          id: item.productId,
          title: item.title,
          description: item.description ?? undefined,
          foodImg: item.foodImg ?? undefined,
          price: Number(item.price),
          categories: rawCategories
            .filter((category) => category.foodId === item.productId)
            .map((category) => ({
              id: category.id,
              name: category.name,
              description: category.description,
            })),
          },
      })),
  })).map((order) => ({
    ...order,
    totalAmount: order.items.reduce((sum, item) => sum + item.totalPrice, 0),
  }));
};

/* Create a real order for the authenticated user using only that user's cart. */
export const checkout = async (
  userId: string,
  shippingAddress: string,
  paymentMethod: string,
) => {
  const cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);

  if (!cart.length) {
    throw new Error("Cart not found");
  }

  const cartId = cart[0].id;

  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId));

  if (!items.length) {
    throw new Error("Cart is empty");
  }

  const newOrder = await db
    .insert(orders)
    .values({
      userId,
      shippingAddress,
      paymentMethod,
    })
    .returning();

  const orderId = newOrder[0].id;

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId,
      foodItemId: item.foodItemId,
      quantity: item.quantity,
      price: item.totalPrice,
      totalPrice: item.totalPrice,
    })),
  );

  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

  const [fullOrder] = await attachItemsToOrders(newOrder);
  return fullOrder;
};

/* Return only orders that belong to the authenticated user. */
export const getOrders = async (userId: string) => {
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId));

  return attachItemsToOrders(userOrders);
};

/* Delete the current user's order history and related child records. */
export const clearOrders = async (userId: string) => {
  const userOrders = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.userId, userId));

  if (userOrders.length === 0) {
    return [];
  }

  const orderIds = userOrders.map((order) => order.id);

  await db.delete(payments).where(inArray(payments.orderId, orderIds));
  await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds));
  await db.delete(orders).where(inArray(orders.id, orderIds));

  return [];
};

/* Return one order only if both order id and user id match. */
export const getOrderById = async (orderId: string, userId: string) => {
  const userOrders = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);

  if (!userOrders.length) {
    throw new Error("Order not found");
  }

  const [fullOrder] = await attachItemsToOrders(userOrders);
  return fullOrder;
};
