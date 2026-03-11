import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { readDashboardSummarySvc } from "../services/dashboardServices.js";

export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const response = await readDashboardSummarySvc(userId);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
