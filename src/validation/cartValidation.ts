// src/validation/cartValidation.ts
import { z } from "zod";

// Add item to cart
export const addCartItemSchema = z.object({
  foodItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

// Update cart item quantity
export const updateCartItemSchema = z.object({
  foodItemId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
});

// Remove cart item
export const removeCartItemSchema = z.object({
  foodItemId: z.string().uuid(),
});

// Types for request inference
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;