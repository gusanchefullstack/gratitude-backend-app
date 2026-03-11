import { jwtVerify, SignJWT } from "jose";
import { createSecretKey } from "crypto";
import { config } from "#config/env.js";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  tokenType?: "access" | "refresh";
  exp?: number;
  [key: string]: unknown;
}

export const generateAccessToken = (payload: JwtPayload) => {
  const secretKey = createSecretKey(config.JWT_SECRET, "utf-8");

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.JWT_ACCESS_EXPIRES_IN)
    .sign(secretKey);
};

export const generateRefreshToken = (payload: JwtPayload) => {
  const refreshSecretKey = createSecretKey(config.JWT_REFRESH_SECRET, "utf-8");

  return new SignJWT({ ...payload, tokenType: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.JWT_REFRESH_EXPIRES_IN)
    .sign(refreshSecretKey);
};

// Backward-compatible alias used by existing imports.
export const generateToken = generateAccessToken;

export const verifyAccessToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(config.JWT_SECRET, "utf-8");
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JwtPayload;
};

export const verifyRefreshToken = async (token: string): Promise<JwtPayload> => {
  const refreshSecretKey = createSecretKey(config.JWT_REFRESH_SECRET, "utf-8");
  const { payload } = await jwtVerify(token, refreshSecretKey);

  if (payload.tokenType !== "refresh") {
    throw new Error("Invalid refresh token type");
  }

  return payload as unknown as JwtPayload;
};

export const verifyToken = verifyAccessToken;

export const issueTokenPair = async (payload: JwtPayload) => {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  return { accessToken, refreshToken };
};
