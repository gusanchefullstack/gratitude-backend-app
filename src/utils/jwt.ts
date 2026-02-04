import { SignJWT } from "jose"
import { createSecretKey } from "crypto"

export interface JwtPayload {
    id: string
    email: string
    username: string
}

export const generateToken = (payload:JwtPayload) => {
    const secret = process.env.JWT_SECRET 
    const secretKey = createSecretKey(secret, "utf-8")

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt().setExpirationTime("1d")
        .sign(secretKey)
    
}