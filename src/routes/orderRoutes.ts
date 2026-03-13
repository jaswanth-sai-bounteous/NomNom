import { Router } from "express";
import { checkout, getOrders, getOrderById } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRoutes = Router();

// Protect all routes
orderRoutes.use(authMiddleware);

orderRoutes.post("/checkout", checkout);
orderRoutes.get("/", getOrders);
orderRoutes.get("/:id", getOrderById);

export default orderRoutes;