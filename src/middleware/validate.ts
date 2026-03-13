import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Use 'issues' instead of 'errors'
      return res.status(400).json({ message: err.issues[0]?.message || "Invalid request" });
    }
    return res.status(500).json({ message: "Server validation error" });
  }
};