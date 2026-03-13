// src/controllers/paymentController.ts
import { Request, Response } from "express";
import stripe from "../config/stripe";
import { AuthRequest } from "../middleware/authMiddleware";

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  const { items } = req.body; // expect items: [{ name, price, quantity }]

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const line_items = items.map((item: any) => ({
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};