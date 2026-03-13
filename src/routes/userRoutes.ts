import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/userController";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validation/authValidation";

const userRoutes = Router();

userRoutes.post("/register", registerLimiter, validate(registerSchema), register);
userRoutes.post("/login", loginLimiter, validate(loginSchema), login);
userRoutes.post("/logout", logout);
userRoutes.post("/refresh", refresh);
userRoutes.get("/me", authMiddleware, me);

export default userRoutes;
