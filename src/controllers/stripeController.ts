// src/controllers/stripeController.ts
import { Request, Response } from "express";
import * as stripeService from "../services/stripeService";

interface AuthRequest extends Request {
  user: { id: string; email: string };
}

export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    // Ensure we have a string, not string[]
    const paymentIntentId = Array.isArray(req.params.paymentIntentId)
      ? req.params.paymentIntentId[0]
      : req.params.paymentIntentId;

    if (!paymentIntentId) throw new Error("PaymentIntent ID is required");

    const payment = await stripeService.retrievePaymentIntent(paymentIntentId);

    res.json({ payment });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};