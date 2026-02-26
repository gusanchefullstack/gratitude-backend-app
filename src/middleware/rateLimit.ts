import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: "Too many requests, please try again later." },
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 30,
  delayMs: () => 2000,
});
