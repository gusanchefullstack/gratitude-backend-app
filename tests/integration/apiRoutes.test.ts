import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import routerapiv1 from "../../src/routes/index.js";
import { errorHandler } from "../../src/middleware/errorHandler.js";

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1", routerapiv1);
  app.use(errorHandler);
  return app;
};

describe("API routes integration", () => {
  it("rejects invalid auth login payload", async () => {
    const app = createTestApp();
    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
  });

  it("rejects unauthenticated gratitude access", async () => {
    const app = createTestApp();
    const response = await request(app).get("/api/v1/gratitudes");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("AUTHENTICATION_ERROR");
  });

  it("returns mantra of the day", async () => {
    const app = createTestApp();
    const response = await request(app).get("/api/v1/mantraoftheday");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Ok");
    expect(typeof response.body.data.mantra).toBe("string");
  });
});
