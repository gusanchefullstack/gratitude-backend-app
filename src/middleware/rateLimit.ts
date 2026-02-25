import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: "Too many requests, please try again later." },
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: () => 2000,
});
