import { Request, Response } from "express";

import type { AuthRequest } from "../types/express";
import * as orderService from "../services/orderService";

/* Create an order from the current authenticated user's cart. */
export const checkout = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { shippingAddress, paymentMethod } = req.body;

    const order = await orderService.checkout(
      user.id,
      shippingAddress,
      paymentMethod,
    );

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};

/* Return only the current user's order history. */
export const getOrders = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const orders = await orderService.getOrders(user.id);
    res.json({ orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};

/* Return one order only if it belongs to the current user. */
export const getOrderById = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!orderId) throw new Error("Order ID is required");

    const order = await orderService.getOrderById(orderId, user.id);
    res.json({ order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ message });
  }
};
