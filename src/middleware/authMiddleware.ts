// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request to include `user`
export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

interface JwtPayload {
  userId: string;
  email?: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = (req as AuthRequest).cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user to request safely
    (req as AuthRequest).user = {
      id: decoded.userId,
      email: decoded.email ?? "",
    };

    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
