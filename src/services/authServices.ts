import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { comparePasswords, hashPasswords } from "../utils/passwords";
import { generateToken } from "../utils/jwt";
import { ConflictError, DatabaseError } from "../utils/errors.js";

export const registerUser = async (user: Prisma.UserCreateInput) => {
  try {
    const hashedPassword = await hashPasswords(user.password);
    const newUser = await prisma.user.create({
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
    const token = await generateToken({
      id: newUser.id,
      email: newUser.username,
      username: newUser.username,
    });
    return { newUser, token };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation (username or email already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        throw new ConflictError(`${field} already exists`);
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
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return { validatedUser, token };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError('Login failed', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};
