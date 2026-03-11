import { Request, Response, NextFunction } from "express";
import { getMantraOfTheDaySvc } from "../services/mantraServices.js";

export const getMantraOfTheDay = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = getMantraOfTheDaySvc();
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
