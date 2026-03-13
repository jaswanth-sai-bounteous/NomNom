import { Router } from "express";
import {
  getFeaturedProducts,
  addFeaturedProduct
} from "../controllers/featuredController";

import { validate } from "../middleware/validate";
import { addFeaturedSchema } from "../validation/featuredValidation";

const featuredRoutes = Router();

/* ================= ROUTES ================= */

featuredRoutes.get("/", getFeaturedProducts);
featuredRoutes.post("/", validate(addFeaturedSchema), addFeaturedProduct);

export default featuredRoutes;