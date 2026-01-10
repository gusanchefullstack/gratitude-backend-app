import { prisma } from "../../lib/prisma";
export const readAllGratitudesSvc = async () => {
  try {
    const listOfGratitude = await prisma.gratitude.findMany();
    return {
      status: "Ok",
      data: listOfGratitude,
      items: listOfGratitude.length,
    };
  } catch (error) {
    throw error;
  }
};

export const readOneGratitudeSvc = async (id: string) => {
  try {
    const listOfGratitude = await prisma.gratitude.findUnique({
      where: { id },
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

export const updateGratitudeSvc = async (id: string, data) => {
  try {
    const listOfGratitude = await prisma.gratitude.update({where:{id}, data:{...data}})
    return {
        status: "Updated",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
  } catch (error) {
    throw error
  }
};

export const deleteGratitudeSvc = async (id: string) => {
  try {
    const listOfGratitude = await prisma.gratitude.delete({where:{id}})
    return {
        status: "Deleted",
        data: Array(listOfGratitude),
        items: Array(listOfGratitude).length,
      };
  } catch (error) {
    throw error
  }
};
