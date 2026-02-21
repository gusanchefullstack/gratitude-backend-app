import { jwtVerify, SignJWT } from "jose";
import { createSecretKey } from "crypto";
import { config } from "#config/env.js";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  [key: string]: unknown;
}

export const generateToken = (payload: JwtPayload) => {
  const secretKey = createSecretKey(config.JWT_SECRET, "utf-8");

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(config.JWT_SECRET, "utf-8");
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JwtPayload;
};
