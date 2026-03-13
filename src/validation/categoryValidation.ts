import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional()
});

export const categoryIdSchema = z.object({
  id: z.string().uuid()
});