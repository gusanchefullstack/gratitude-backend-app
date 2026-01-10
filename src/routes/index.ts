import { Router } from "express";
import gratitudesRouter from "./gratitudeRoutes.js";

const routerapiv1 = Router();

routerapiv1.use("/gratitudes", gratitudesRouter)
export default routerapiv1;