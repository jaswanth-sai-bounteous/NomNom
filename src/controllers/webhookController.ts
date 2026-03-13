// src/controllers/webhookController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripe";

export const stripeWebhook = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Payment successful for user:", session.metadata?.userId);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error(message);
    res.status(400).send(`Webhook Error: ${message}`);
  }
};
