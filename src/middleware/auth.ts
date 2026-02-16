import { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../utils/jwt";
import { AuthenticationError } from "../utils/errors.js";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader?.split(" ")[1]

        if (!token) {
            throw new AuthenticationError("Authentication token required");
        }

        const payload = await verifyToken(token)
        req.user = payload;
        next()
    } catch (error) {
        // If it's already our custom error, pass it through
        if (error instanceof AuthenticationError) {
            next(error);
            return;
        }

        // Handle JWT-specific errors from jose library
        if (error && typeof error === 'object') {
            const err = error as any;

            // Check for expired token
            if (err.code === 'ERR_JWT_EXPIRED' || err.name === 'JWTExpired' ||
                (err.message && err.message.includes('expired'))) {
                next(new AuthenticationError("Token has expired"));
                return;
            }

            // Check for invalid signature or malformed token
            if (err.name === 'JWSSignatureVerificationFailed' ||
                err.name === 'JWSInvalid' ||
                err.name === 'JWTInvalid' ||
                (err.message && err.message.includes('signature'))) {
                next(new AuthenticationError("Invalid authentication token"));
                return;
            }
        }

        // Generic authentication error for other JWT failures
        next(new AuthenticationError("Invalid authentication token"));
    }
}