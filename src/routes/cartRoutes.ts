// src/routes/cartRoutes.ts
import { Router } from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cartController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validation/cartValidation";

const cartRoutes = Router();




/* ================= ROUTES ================= */
cartRoutes.get("/", authMiddleware, getCart);
cartRoutes.post("/add", authMiddleware, validate(addCartItemSchema), addItem);
cartRoutes.put("/update", authMiddleware, validate(updateCartItemSchema), updateItem);
cartRoutes.delete("/remove", authMiddleware, validate(removeCartItemSchema), removeItem);
cartRoutes.delete("/clear", authMiddleware, clearCart);
export default cartRoutes;