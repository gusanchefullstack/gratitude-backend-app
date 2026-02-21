// index.js
import express from "express";
import cors from "cors";
import routerapiv1 from "#routes/index.js";
import { errorHandler } from "#middleware/errorHandler.js";
import { config } from "#config/env.js";

const app = express();
const port = config.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/v1", routerapiv1);

// Global error handler - MUST be registered after all routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
