import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory
} from "../controllers/categoryController";

import { validate } from "../middleware/validate";
import { createCategorySchema } from "../validation/categoryValidation";

const categoryRoutes = Router();

/* ================= ROUTES ================= */

categoryRoutes.get("/", getAllCategories);  
categoryRoutes.get("/:id", getCategoryById);

categoryRoutes.post("/", validate(createCategorySchema), createCategory);

export default categoryRoutes;