// src/controllers/paymentController.ts
import { Request, Response } from "express";
import stripe from "../config/stripe";
import { AuthRequest } from "../middleware/authMiddleware";

type CheckoutItemInput = {
  name: string;
  price: number;
  quantity: number;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  const { items } = req.body as { items?: CheckoutItemInput[] };

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Checkout items are required" });
  }

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    console.error(error);
    res.status(500).json({ message });
  }
};
