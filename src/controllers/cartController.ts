import { Request, Response } from "express";

import type { AuthRequest } from "../types/express";
import * as cartService from "../services/cartService";
import { addCartItemSchema } from "../validation/cartValidation";

/* Return the authenticated user's cart only. */
export const getCart = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const cart = await cartService.getCartByUserId(user.id);
    res.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message });
  }
};

export const addItem = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    addCartItemSchema.parse(req.body);
    const { foodItemId, quantity } =addCartItemSchema.parse(req.body);
    const cart = await cartService.addItemToCart(user.id, foodItemId, quantity);
    res.status(201).json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { foodItemId, quantity } = req.body;
    const cart = await cartService.updateCartItem(user.id, foodItemId, quantity);
    res.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { foodItemId } = req.body;
    const cart = await cartService.removeCartItem(user.id, foodItemId);
    res.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const cart = await cartService.clearCart(user.id);
    res.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message });
  }
};
