import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ConflictError, NotFoundError, DatabaseError } from "../utils/errors.js";
export const createGratitudeSvc = async (data: Prisma.GratitudeUncheckedCreateInput) => {
  try {
      const listIfGratitude = await prisma.gratitude.create({
        data
      })
      return {
        status: "Created",
        data: Array(listIfGratitude),
        items: Array(listIfGratitude).length,
      };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation (title already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'title';
        throw new ConflictError(`Gratitude with this ${field} already exists`);
      }

      // P2003 - Foreign key constraint failed (invalid userId)
      if (error.code === 'P2003') {
        throw new NotFoundError('User not found');
      }

      // Other Prisma errors
      throw new DatabaseError('Failed to create gratitude', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};
export const readAllGratitudesSvc = async (userId:string) => {
  try {
    const listOfGratitude = await prisma.gratitude.findMany({
      where: {
        userId
      }
    });
    return {
      status: "Ok",
      data: listOfGratitude,
      items: listOfGratitude.length,
    };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError('Failed to retrieve gratitudes', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};

export const readOneGratitudeSvc = async (userId:string, id: string) => {
  try {
    const listOfGratitude = await prisma.gratitude.findUnique({
      where: {
          userId,
          id
        }
    });
    if (!listOfGratitude) {
      return {
        status: "Ok",
        data: [],
        items: 0,
      };
    } else {
      return {
        status: "Ok",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
    }
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError('Failed to retrieve gratitude', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};


export const updateGratitudeSvc = async (userId: string, id: string, data: Prisma.GratitudeUncheckedUpdateInput) => {
  try {
    const listOfGratitude = await prisma.gratitude.update({where:{userId, id}, data:{...data}})
    return {
        status: "Updated",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 - Record not found
      if (error.code === 'P2025') {
        throw new NotFoundError('Gratitude not found');
      }

      // P2002 - Unique constraint violation (title already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'title';
        throw new ConflictError(`Gratitude with this ${field} already exists`);
      }

      // Other Prisma errors
      throw new DatabaseError('Failed to update gratitude', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};

export const deleteGratitudeSvc = async (userId:string, id: string) => {
  try {
    const listOfGratitude = await prisma.gratitude.delete({
      where: {
        id,
        userId
    }})
    return {
        status: "Deleted",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
  } catch (error) {
    // Transform Prisma errors into custom errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 - Record not found
      if (error.code === 'P2025') {
        throw new NotFoundError('Gratitude not found');
      }

      // Other Prisma errors
      throw new DatabaseError('Failed to delete gratitude', error.code);
    }

    // Unknown errors pass through
    throw error;
  }
};
