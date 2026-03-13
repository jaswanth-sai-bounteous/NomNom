import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.enum(["card", "upi", "cod"]), // example
});