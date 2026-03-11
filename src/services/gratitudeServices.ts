import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ConflictError, NotFoundError, DatabaseError } from "../utils/errors.js";

type GratitudeListQuery = {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  sortBy: "createdAt" | "updatedAt" | "title";
  order: "asc" | "desc";
};
export const createGratitudeSvc = async (data: Prisma.GratitudeUncheckedCreateInput) => {
  try {
      const createdGratitude = await prisma.gratitude.create({
        data
      })
      return {
        status: "Created",
        data: createdGratitude,
        items: 1,
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
export const readAllGratitudesSvc = async (
  userId: string,
  query: GratitudeListQuery,
) => {
  try {
    const { page, limit, search, tag, sortBy, order } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.GratitudeWhereInput = {
      userId,
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          details: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const [listOfGratitude, totalItems] = await prisma.$transaction([
      prisma.gratitude.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.gratitude.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
      status: "Ok",
      data: listOfGratitude,
      items: listOfGratitude.length,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
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
    const gratitude = await prisma.gratitude.findUnique({
      where: {
          userId,
          id
        }
    });
    if (!gratitude) {
      throw new NotFoundError("Gratitude not found");
    }
    return {
      status: "Ok",
      data: gratitude,
      items: 1,
    };
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
    const updatedGratitude = await prisma.gratitude.update({where:{userId, id}, data:{...data}})
    return {
        status: "Updated",
        data: updatedGratitude,
        items: 1,
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
    const deletedGratitude = await prisma.gratitude.delete({
      where: {
        id,
        userId
    }})
    return {
        status: "Deleted",
        data: deletedGratitude,
        items: 1,
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
