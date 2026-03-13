// src/services/stripeService.ts
import Stripe from "stripe";
import { db } from "../db/db";
import { orders, orderItems } from "../db/schema";
import { eq } from "drizzle-orm";

// Use correct Stripe API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15" as unknown as Stripe.LatestApiVersion,
});

/**
 * Create Stripe payment intent
 */
export const createPaymentIntent = async (orderId: string) => {
  // Fetch order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .execute();

  if (!items.length) throw new Error("No items found for this order");

  // Calculate total amount in paise/cents
  const amount = items.reduce((acc, item) => acc + Number(item.totalPrice), 0) * 100;

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  return paymentIntent;
};

/**
 * Retrieve a payment intent
 */
export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};