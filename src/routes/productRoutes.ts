import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../validation/productValidation";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/search", searchProducts);
productRoutes.get("/category/:id", getProductsByCategory);
productRoutes.get("/:id", getProductById);
productRoutes.post("/", validate(createProductSchema), createProduct);

export default productRoutes;
