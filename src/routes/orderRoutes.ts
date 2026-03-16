import { Router } from "express";
import { checkout, clearOrders, getOrders, getOrderById } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRoutes = Router();

// Protect all routes
orderRoutes.use(authMiddleware);

orderRoutes.post("/checkout", checkout);
orderRoutes.delete("/", clearOrders);
orderRoutes.get("/", getOrders);
orderRoutes.get("/:id", getOrderById);

export default orderRoutes;
