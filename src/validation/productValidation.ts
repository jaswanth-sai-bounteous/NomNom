import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  foodImg: z.string().optional(),
  price: z.number().positive()
});

export const getProductByIdSchema = z.object({
  id: z.string().uuid()
});

export const searchProductSchema = z.object({
  q: z.string().min(1)
});