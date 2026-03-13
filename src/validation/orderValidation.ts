import { z } from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(10),
  paymentMethod: z.enum(["COD", "ONLINE"])
});