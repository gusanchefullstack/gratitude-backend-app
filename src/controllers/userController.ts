import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import {
  changeMyPasswordSvc,
  readMyProfileSvc,
  updateMyProfileSvc,
} from "../services/userServices.js";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const response = await readMyProfileSvc(userId);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const response = await updateMyProfileSvc(userId, req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateMyPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    await changeMyPasswordSvc(userId, currentPassword, newPassword);

    return res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
