// src/routes/webhookRoutes.ts
import { Router } from "express";
import { stripeWebhook } from "../controllers/webhookController";

const webhookRoutes = Router();

// Stripe requires raw body, set in app.ts with `express.raw({ type: 'application/json' })`
webhookRoutes.post("/stripe", stripeWebhook);

export default webhookRoutes;