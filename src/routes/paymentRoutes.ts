// src/routes/paymentRoutes.ts
import { Router } from "express";
import { createCheckoutSession } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const paymentRoutes = Router();

paymentRoutes.use(authMiddleware);

paymentRoutes.post("/create-checkout-session", createCheckoutSession);

export default paymentRoutes;