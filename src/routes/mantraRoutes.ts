import { Router } from "express";
import { getMantraOfTheDay } from "../controllers/mantraController.js";

const mantraRouter = Router();

mantraRouter.get("/", getMantraOfTheDay);

export default mantraRouter;
