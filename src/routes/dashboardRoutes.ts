import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.get("/summary", getDashboardSummary);

export default dashboardRouter;
