import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh
} from "../controllers/userController";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter";  
import { loginSchema, registerSchema } from "../validation/authValidation";
import { validate } from "../middleware/validate";
const userRouter = Router();

userRouter.post("/register", registerLimiter,validate(registerSchema), register);
userRouter.post("/login", loginLimiter,  validate(loginSchema),login);
userRouter.post("/logout", logout);
userRouter.post("/refresh", refresh);
export default userRouter;