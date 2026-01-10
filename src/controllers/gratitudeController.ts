import { Request, Response, NextFunction } from "express";
import {
  readAllGratitudesSvc,
  readOneGratitudeSvc,
  createGratitudeSvc,
  updateGratitudeSvc,
  deleteGratitudeSvc,
} from "../services/gratitudeServices";

export const getAllGratitudes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gratitudes = await readAllGratitudesSvc();
    return res.json(gratitudes);
  } catch (error) {
    next(error);
  }
};
export const getSingleGratitude = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const gratitude = await readOneGratitudeSvc(id);
    return res.json(gratitude);
  } catch (error) {
    next(error);
  }
};
export const createGratitude = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const gratitude = await createGratitudeSvc(data);
    return res.json(gratitude);
  } catch (error) {
    next(error);
  }
};
export const updateGratitude = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const gratitude = await updateGratitudeSvc(id, data);
    return res.json(gratitude);
  } catch (error) {
    next(error);
  }
};
export const deleteGratitude = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const gratitude = await deleteGratitudeSvc(id);
    return res.json(gratitude);
  } catch (error) {
    next(error);
  }
};
