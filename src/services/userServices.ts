import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { comparePasswords, hashPasswords } from "../utils/passwords.js";
import {
  AuthenticationError,
  ConflictError,
  DatabaseError,
  NotFoundError,
} from "../utils/errors.js";

const userPublicSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export const readMyProfileSvc = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      status: "Ok",
      data: user,
      items: 1,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError("Failed to retrieve profile", error.code);
    }

    throw error;
  }
};

export const updateMyProfileSvc = async (
  userId: string,
  data: Prisma.UserUpdateInput,
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });

    return {
      status: "Updated",
      data: updatedUser,
      items: 1,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }

      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || "field";
        throw new ConflictError(`${field} already exists`);
      }

      throw new DatabaseError("Failed to update profile", error.code);
    }

    throw error;
  }
};

export const changeMyPasswordSvc = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await comparePasswords(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError("Current password is incorrect");
    }

    const hashedPassword = await hashPasswords(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      status: "Updated",
      data: null,
      items: 0,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof AuthenticationError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError("Failed to update password", error.code);
    }

    throw error;
  }
};
