// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routerapiv1 from "#routes/index.js";
import { errorHandler } from "#middleware/errorHandler.js";
import { config } from "#config/env.js";
import { limiter, speedLimiter } from "#middleware/rateLimit.js";
import { attachRequestId, requestLogger } from "#middleware/observability.js";

const app = express();
const port = config.PORT;
const allowedOrigins = (config.FRONTEND_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header), like curl and server-to-server calls.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (config.NODE_ENV !== "production") {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
  }),
);
app.use(helmet());
app.use(attachRequestId);
app.use(requestLogger);
app.use(express.json());
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/v1", speedLimiter, limiter, routerapiv1);

// Global error handler - MUST be registered after all routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Gratitude backend app listening on port ${port}`);
});
