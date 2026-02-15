import { Request, Response, NextFunction } from "express";
import {
  readAllGratitudesSvc,
  readOneGratitudeSvc,
  createGratitudeSvc,
  updateGratitudeSvc,
  deleteGratitudeSvc,
} from "#services/gratitudeServices.js";
import { AuthenticatedRequest } from "../middleware/auth";

export const createGratitude = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { title, details, tags } = req.body;
    const data = { userId, ...req.body };
    const response = await createGratitudeSvc(data);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
export const getAllGratitudes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const response = await readAllGratitudesSvc(userId);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
export const getSingleGratitude = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const response = await readOneGratitudeSvc(userId, id);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateGratitude = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id
    const data = req.body;
    const response = await updateGratitudeSvc(userId, id, data);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
export const deleteGratitude = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const response = await deleteGratitudeSvc(userId, id);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
