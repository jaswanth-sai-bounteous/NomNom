import rateLimit from "express-rate-limit";

// Login rate limiter: 5 attempts per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // limit each IP to 5 requests per window
  message: {
    status: 429,
    message: "Too many login attempts from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

// Optional: Register limiter (less strict)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 account creations per IP per hour
  message: {
    status: 429,
    message: "Too many account creations from this IP, try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});