import { Prisma } from "../../generated/prisma/client.js";
import { createHash } from "crypto";
import { prisma } from "../../lib/prisma.js";
import { comparePasswords, hashPasswords } from "../utils/passwords.js";
import { issueTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import { AuthenticationError, ConflictError, DatabaseError } from "../utils/errors.js";

const buildTokenPayload = (user: {
  id: string;
  username: string;
  email: string;
}) => ({
  id: user.id,
  email: user.email,
  username: user.username,
});

const hashRefreshToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const getRefreshTokenExpiry = (payload: { exp?: unknown }) => {
  if (typeof payload.exp !== "number") {
    throw new AuthenticationError("Invalid refresh token");
  }

  return new Date(payload.exp * 1000);
};

const persistRefreshSession = async (
  tx: Prisma.TransactionClient,
  userId: string,
  refreshToken: string,
) => {
  const payload = await verifyRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry(payload);

  await tx.refreshSession.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt,
    },
  });
};

export const registerUser = async (user: Prisma.UserCreateInput) => {
  try {
    const { newUser, tokens } = await prisma.$transaction(async (tx) => {
      const hashedPassword = await hashPasswords(user.password);
      const createdUser = await tx.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      const issuedTokens = await issueTokenPair(buildTokenPayload(createdUser));
      await persistRefreshSession(tx, createdUser.id, issuedTokens.refreshToken);

      return {
        newUser: createdUser,
        tokens: issuedTokens,
      };
    });

    return { newUser, ...tokens };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation (username or email already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        throw new ConflictError(`${field} already exists`);
      }

      // P2021 - Table does not exist (migrations not applied)
      if (error.code === "P2021") {
        throw new DatabaseError(
          "Database schema is out of date. Run Prisma migrations and retry.",
          error.code,
        );
      }

      // Other Prisma errors
      throw new DatabaseError('Failed to create user', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const { username, password } = credentials;
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      return null;
    }
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const validatedUser = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const tokens = await issueTokenPair(buildTokenPayload(user));
    await persistRefreshSession(prisma, user.id, tokens.refreshToken);

    return { validatedUser, ...tokens };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError('Login failed', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};

export const refreshAuthSession = async (refreshToken: string) => {
  try {
    const payload = await verifyRefreshToken(refreshToken);
    const tokenHash = hashRefreshToken(refreshToken);
    const activeSession = await prisma.refreshSession.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!activeSession || activeSession.userId !== payload.id) {
      throw new AuthenticationError("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new AuthenticationError("Invalid refresh token");
    }

    const tokens = await issueTokenPair(buildTokenPayload(user));
    const newPayload = await verifyRefreshToken(tokens.refreshToken);
    const expiresAt = getRefreshTokenExpiry(newPayload);

    await prisma.$transaction([
      prisma.refreshSession.update({
        where: { id: activeSession.id },
        data: {
          revokedAt: new Date(),
        },
      }),
      prisma.refreshSession.create({
        data: {
          userId: user.id,
          tokenHash: hashRefreshToken(tokens.refreshToken),
          expiresAt,
        },
      }),
    ]);

    return {
      user,
      ...tokens,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }

    throw new AuthenticationError("Invalid refresh token");
  }
};

export const logoutAuthSession = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshSession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
