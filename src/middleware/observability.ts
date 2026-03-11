import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export interface RequestWithId extends Request {
  requestId?: string;
}

export const attachRequestId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestWithId = req as RequestWithId;
  requestWithId.requestId = randomUUID();
  res.setHeader("X-Request-Id", requestWithId.requestId);
  next();
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestWithId = req as RequestWithId;
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.info(
      JSON.stringify({
        level: "info",
        event: "http_request",
        requestId: requestWithId.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs,
        timestamp: new Date().toISOString(),
      }),
    );
  });

  next();
};
