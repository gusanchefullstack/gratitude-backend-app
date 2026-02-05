import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const registerUser = async (
  user: Prisma.UserCreateInput,
): Promise<Omit<Prisma.UserModel, "password" | "createdAt" | "updatedAt">> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...user,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};
