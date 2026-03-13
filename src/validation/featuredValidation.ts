import { z } from "zod";

export const addFeaturedSchema = z.object({
  foodId: z.string().uuid()
});