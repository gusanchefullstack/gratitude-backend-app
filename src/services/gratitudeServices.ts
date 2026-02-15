import { prisma } from "../../lib/prisma";
export const createGratitudeSvc = async (data) => {
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
    throw error
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
    throw error;
  }
};


export const updateGratitudeSvc = async (userId: string, id: string, data) => {
  try {
    const listOfGratitude = await prisma.gratitude.update({where:{userId, id}, data:{...data}})
    return {
        status: "Updated",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
  } catch (error) {
    throw error
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
    throw error
  }
};
